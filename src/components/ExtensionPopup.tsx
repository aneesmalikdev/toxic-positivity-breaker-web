import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { humanifyEngine } from '@/lib/humanify'

interface PopupStats {
  isEnabled: boolean
  totalReplacements: number
  activeTab: string
}

export const ExtensionPopup = () => {
  const [stats, setStats] = useState<PopupStats>({
    isEnabled: true,
    totalReplacements: 0,
    activeTab: 'current page',
  })

  useEffect(() => {
    // Initialize state from storage
    setStats((prev) => ({
      ...prev,
      isEnabled: humanifyEngine.isHumanifyEnabled(),
      totalReplacements: parseInt(localStorage.getItem('humanify-total-replacements') || '0'),
    }))
  }, [])

  const handleToggle = (enabled: boolean) => {
    humanifyEngine.setEnabled(enabled)
    setStats((prev) => ({ ...prev, isEnabled: enabled }))

    // In Chrome extension, this would send message to content script
    document.dispatchEvent(
      new CustomEvent('humanify-toggle', {
        detail: { enabled },
      })
    )
  }

  const handleScanNow = () => {
    if (stats.isEnabled) {
      const newReplacements = humanifyEngine.scanPage()
      const total = stats.totalReplacements + newReplacements
      setStats((prev) => ({ ...prev, totalReplacements: total }))
      localStorage.setItem('humanify-total-replacements', total.toString())
    }
  }

  return (
    <div className='extension-popup p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>💔</div>
          <div>
            <h1 className='text-lg font-semibold text-foreground'>Humanify</h1>
            <p className='text-xs text-muted-foreground'>Replace toxic positivity</p>
          </div>
        </div>
        <div className='text-2xl'>❤️‍🩹</div>
      </div>

      {/* Toggle Switch */}
      <div className='flex items-center justify-between p-4 bg-secondary/50 rounded-lg mb-4'>
        <div>
          <h3 className='font-medium text-foreground'>Extension Status</h3>
          <p className='text-sm text-muted-foreground'>
            {stats.isEnabled ? 'Active on this page' : 'Paused'}
          </p>
        </div>
        <Switch
          checked={stats.isEnabled}
          onCheckedChange={handleToggle}
          className='data-[state=checked]:bg-primary'
        />
      </div>

      {/* Stats */}
      <div className='space-y-3 mb-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Total humanified</span>
          <Badge variant='secondary' className='bg-accent text-accent-foreground'>
            {stats.totalReplacements}
          </Badge>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Active on</span>
          <Badge variant='outline'>{stats.activeTab}</Badge>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleScanNow}
        disabled={!stats.isEnabled}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          stats.isEnabled
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {stats.isEnabled ? 'Scan Page Now' : 'Enable to Scan'}
      </button>

      {/* Footer */}
      <div className='mt-6 pt-4 border-t border-border'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>v1.0.0</span>
          <div className='flex items-center gap-1'>
            <span>Made by</span>
            <span className='text-primary'>@aneesMalikDev</span>
          </div>
        </div>
      </div>
    </div>
  )
}
