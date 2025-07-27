import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExtensionPopup } from '@/components/ExtensionPopup'
import { TextDemo } from '@/components/TextDemo'

const Index = () => {
  const [activeTab, setActiveTab] = useState('popup')

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <span className='text-4xl'>💔</span>
            <h1 className='text-4xl font-bold text-foreground'>Humanify</h1>
            <span className='text-4xl'>❤️‍🩹</span>
          </div>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Chrome Extension MVP that replaces toxic positivity with authentic, human responses
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-8'>
            <TabsTrigger value='popup'>Extension Popup</TabsTrigger>
            <TabsTrigger value='demo'>Text Demo</TabsTrigger>
          </TabsList>

          {/* Extension Popup Preview */}
          <TabsContent value='popup' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Chrome Extension Popup Interface</CardTitle>
                <CardDescription>
                  This is exactly how your Chrome extension popup will look and function
                </CardDescription>
              </CardHeader>
              <CardContent className='flex justify-center'>
                <ExtensionPopup />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Demo */}
          <TabsContent value='demo' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Test the Replacement Logic</CardTitle>
                <CardDescription>
                  Try the core text replacement functionality that powers the extension
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
