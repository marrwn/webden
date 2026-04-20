'use client';

import React from 'react';
import { GameConfig } from '@/types/game';
import { generateWebDenJSON } from '@/lib/jsonExporter';
import { generateHTML, generateCSS, generateJavaScript } from '@/lib/codeGenerator';
import { Download, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeExporterProps {
  config: GameConfig;
}

export default function CodeExporter({ config }: CodeExporterProps) {
  const html = generateHTML(config);
  const css = generateCSS(config);
  const js = generateJavaScript(config);

  const handleDownloadJson = () => {
    const data = generateWebDenJSON(config);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breakout-game-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded JSON formatted for WebDen!');
  };

  const handleCopyJson = async () => {
    const data = generateWebDenJSON(config);
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied JSON to clipboard');
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success('Copied code to clipboard');
  };

  React.useEffect(() => {
    Prism.highlightAll();
  }, [html, css, js]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-xl font-bold mb-4">Export Options</h2>
        
        <div className="space-y-3 flex-none">
          <Button 
            className="w-full bg-gradient-to-r from-[#F85A5E] to-[#DC2626] hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-white border-0" 
            size="lg" 
            onClick={handleDownloadJson}
          >
            <Download size={20} className="mr-2" />
            Download JSON
          </Button>

          <Button variant="outline" className="w-full h-10" onClick={handleCopyJson}>
            <Copy size={18} className="mr-2" />
            Copy JSON
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col h-full min-h-[400px]">
        <Tabs defaultValue="html" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          
          {(['html', 'css', 'js'] as const).map(tab => {
            const code = tab === 'html' ? html : tab === 'css' ? css : js;
            return (
              <TabsContent key={tab} value={tab} className="flex-1 mt-3">
                <div className="rounded-md border bg-zinc-950 overflow-hidden relative group h-full flex flex-col min-h-[400px]">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700 text-zinc-300 backdrop-blur-sm border border-white/10 z-10 h-8 w-8"
                    onClick={() => handleCopyCode(code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <div className="overflow-auto flex-1 p-4 text-sm font-mono custom-scrollbar absolute inset-0">
                    <pre className="!m-0 !bg-transparent"><code className={`language-${tab === 'js' ? 'javascript' : tab}`}>{code}</code></pre>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
