import { NextRequest, NextResponse } from 'next/server';
import { GameConfig } from '@/types/game';
import { generateWebDenJSON } from '@/lib/jsonExporter';
import { generateHTML, generateCSS, generateJavaScript } from '@/lib/codeGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = body.config as GameConfig;

    if (!config || !config.ballColor) {
      return NextResponse.json({ success: false, error: 'Invalid configuration' }, { status: 400 });
    }

    const html = generateHTML(config);
    const css = generateCSS(config);
    const javascript = generateJavaScript(config);
    const json = generateWebDenJSON(config);

    return NextResponse.json({
      success: true,
      html,
      css,
      javascript,
      json
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate code' }, { status: 500 });
  }
}
