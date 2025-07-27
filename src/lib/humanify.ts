// Core Humanify Text Replacement Logic
// This can be directly used in a Chrome extension content script

export interface ReplacementConfig {
  [key: string]: string;
}

export const TOXIC_POSITIVITY_REPLACEMENTS: ReplacementConfig = {
  "good vibes only": "It's okay to feel messy today. 💙",
  "just think positive": "This sucks. Want to talk?",
  "everything happens for a reason": "That's devastating. I'm here.",
  "look on the bright side": "Your pain is valid.",
  "you got this": "This is hard. How can I support you?",
  "stay positive": "Your feelings matter, whatever they are.",
  "don't worry be happy": "Worry is normal. What's weighing on you?",
  "turn that frown upside down": "It's okay to not be okay right now.",
  "positive thoughts only": "All your thoughts are welcome here.",
  "choose happiness": "Sometimes we can't choose how we feel, and that's human.",
  "count your blessings": "This moment is tough. I see you struggling.",
  "it could be worse": "This situation is hard enough as it is.",
  "smile more": "You don't owe anyone a smile when you're hurting.",
};

export class HumanifyEngine {
  private replacements: ReplacementConfig;
  private isEnabled: boolean;

  constructor(customReplacements?: ReplacementConfig) {
    this.replacements = customReplacements || TOXIC_POSITIVITY_REPLACEMENTS;
    this.isEnabled = this.getEnabledState();
  }

  private getEnabledState(): boolean {
    // In Chrome extension, this would use chrome.storage
    return localStorage.getItem('humanify-enabled') !== 'false';
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('humanify-enabled', enabled.toString());
  }

  public isHumanifyEnabled(): boolean {
    return this.isEnabled;
  }

  public getReplacements(): ReplacementConfig {
    return this.replacements;
  }

  private createRegexPattern(phrase: string): RegExp {
    // Escape special regex characters and create case-insensitive pattern
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'gi');
  }

  public replaceTextInElement(element: Element): number {
    if (!this.isEnabled) return 0;

    let replacementCount = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      let content = textNode.textContent || '';
      let hasReplacement = false;

      Object.entries(this.replacements).forEach(([toxic, human]) => {
        const regex = this.createRegexPattern(toxic);
        if (regex.test(content)) {
          content = content.replace(regex, human);
          hasReplacement = true;
          replacementCount++;
        }
      });

      if (hasReplacement) {
        // Create a span element with the humanified styling
        const span = document.createElement('span');
        span.className = 'humanified-text';
        span.textContent = content;
        
        // Replace the text node with our styled span
        textNode.parentNode?.replaceChild(span, textNode);
      }
    });

    return replacementCount;
  }

  public replaceTextInString(text: string): { text: string; replacements: string[] } {
    if (!this.isEnabled) return { text, replacements: [] };

    let result = text;
    const foundReplacements: string[] = [];

    Object.entries(this.replacements).forEach(([toxic, human]) => {
      const regex = this.createRegexPattern(toxic);
      if (regex.test(result)) {
        result = result.replace(regex, human);
        foundReplacements.push(`"${toxic}" → "${human}"`);
      }
    });

    return { text: result, replacements: foundReplacements };
  }

  public scanPage(): number {
    if (!this.isEnabled) return 0;

    // Target common content areas (social media sites)
    const selectors = [
      '[data-testid="tweetText"]', // Twitter
      '[data-pagelet="FeedUnit"]', // Facebook
      '.feed-shared-update-v2', // LinkedIn
      'article', // General articles
      '.post', // Generic posts
      '.comment', // Comments
      '.status', // Status updates
    ];

    let totalReplacements = 0;

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        totalReplacements += this.replaceTextInElement(element);
      });
    });

    return totalReplacements;
  }
}

// Export singleton instance for extension use
export const humanifyEngine = new HumanifyEngine();

// Chrome extension content script would use this
export function initContentScript(): void {
  const engine = humanifyEngine;
  
  // Initial scan
  engine.scanPage();

  // Watch for new content (for dynamic sites like Twitter/Facebook)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          engine.replaceTextInElement(node as Element);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Listen for enable/disable changes from popup
  document.addEventListener('humanify-toggle', ((event: CustomEvent) => {
    engine.setEnabled(event.detail.enabled);
    if (event.detail.enabled) {
      engine.scanPage();
    }
  }) as EventListener);
}