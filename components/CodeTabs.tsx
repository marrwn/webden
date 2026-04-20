import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onCopyToggle: (tab: string, code: string) => void;
}

export default function CodeTabs({ html, css, js, onCopyToggle }: CodeTabsProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [html, css, js]);

  return (
    <Tabs defaultValue="html" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        </TabsList>
      </div>

      {(['html', 'css', 'javascript'] as const).map(tab => {
        const code = tab === 'html' ? html : tab === 'css' ? css : js;
        return (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="rounded-md border bg-zinc-950 overflow-hidden relative group">
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 backdrop-blur-sm border border-white/10 z-10"
                onClick={() => onCopyToggle(tab, code)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <div className="overflow-auto max-h-[500px] p-4 text-sm font-mono custom-scrollbar">
                <pre className="!m-0 !bg-transparent"><code className={`language-${tab}`}>{code}</code></pre>
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
