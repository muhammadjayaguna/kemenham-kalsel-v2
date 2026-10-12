import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt, systemInstruction } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey =
      process.env.GOOGLE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY ||
      ''

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI API key is not configured' },
        { status: 500 }
      )
    }

    // Call Gemini API via Google AI Studio Endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemInstruction
                ? `${systemInstruction}\n\nInput User:\n${prompt}`
                : prompt,
            },
          ],
        },
      ],
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API Error Response:', errText)
      return NextResponse.json(
        { error: 'Gagal menghubungi Google AI Gemini Service.' },
        { status: res.status }
      )
    }

    const data = await res.json()
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ text: generatedText })
  } catch (error: any) {
    console.error('AI Route error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem AI: ' + error.message },
      { status: 500 }
    )
  }
}
