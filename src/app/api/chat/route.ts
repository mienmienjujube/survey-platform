import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      // Simulate delay for mock response
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({
        choices: [{
          message: {
            role: 'assistant',
            content: '(这是一个模拟回复，因为未配置真实的 DeepSeek API Key。您可以请教我关于实验的任何问题。)'
          }
        }]
      });
    }

    const payloadMessages = [];
    if (systemPrompt) {
      payloadMessages.push({ role: 'system', content: systemPrompt });
    }
    payloadMessages.push(...messages);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: payloadMessages,
        stream: false
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Deepseek Error Details:", errData);
      return NextResponse.json({ error: errData.error?.message || `API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error proxying chat:', error);
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 });
  }
}
