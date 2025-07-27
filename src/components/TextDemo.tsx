import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { humanifyEngine } from '@/lib/humanify';

export const TextDemo = () => {
  const [inputText, setInputText] = useState(`
Hey there! Just think positive and everything will work out. Good vibes only! 
Look on the bright side - everything happens for a reason. You got this! 
Don't worry be happy, turn that frown upside down. Stay positive and count your blessings!
  `.trim());
  
  const [outputText, setOutputText] = useState('');
  const [replacements, setReplacements] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(humanifyEngine.isHumanifyEnabled());
  }, []);

  const handleHumanify = () => {
    const result = humanifyEngine.replaceTextInString(inputText);
    setOutputText(result.text);
    setReplacements(result.replacements);
  };

  const handleToggleEngine = () => {
    const newState = !isEnabled;
    humanifyEngine.setEnabled(newState);
    setIsEnabled(newState);
    
    if (!newState) {
      setOutputText('');
      setReplacements([]);
    }
  };

  const handleReset = () => {
    setInputText(`
Hey there! Just think positive and everything will work out. Good vibes only! 
Look on the bright side - everything happens for a reason. You got this! 
Don't worry be happy, turn that frown upside down. Stay positive and count your blessings!
    `.trim());
    setOutputText('');
    setReplacements([]);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handleToggleEngine}
          variant={isEnabled ? "default" : "secondary"}
          className="flex items-center gap-2"
        >
          {isEnabled ? '💔' : '❤️‍🩹'} 
          {isEnabled ? 'Disable' : 'Enable'} Humanify
        </Button>
        <Button onClick={handleHumanify} disabled={!isEnabled}>
          Transform Text
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset Demo
        </Button>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Original Text (Toxic Positivity)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with toxic positivity phrases..."
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Output */}
      {outputText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Humanified Text 
              <Badge variant="secondary">{replacements.length} changes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-4 bg-secondary/30 rounded-lg border min-h-[120px] leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: outputText.replace(/\n/g, '<br>') 
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Replacements List */}
      {replacements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transformations Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {replacements.map((replacement, index) => (
                <div key={index} className="text-sm p-3 bg-accent/20 rounded border-l-4 border-l-primary">
                  {replacement}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dictionary Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phrase Dictionary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Object.entries(humanifyEngine.getReplacements()).slice(0, 5).map(([toxic, human], index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-destructive">"{toxic}"</div>
                  <div className="text-sm text-muted-foreground mt-1">↓</div>
                  <div className="text-sm text-foreground">"{human}"</div>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground text-center pt-2">
              + {Object.keys(humanifyEngine.getReplacements()).length - 5} more phrases...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};