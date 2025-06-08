import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ошибка API:', error);
    return NextResponse.error();
  }
}