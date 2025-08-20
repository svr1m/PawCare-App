import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const hfResponse = await fetch('https://api-inference.huggingface.co/models/skyau/dog-breed-classifier-vit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    const text = await hfResponse.text();

    // ✅ Log the raw response for debugging
    console.log('Hugging Face response (raw):', text);

    // ❌ If it's an HTML error, this will fail
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON. Likely an HTML error page from HF.');
      return NextResponse.json({ error: 'Invalid JSON response from Hugging Face' }, { status: 500 });
    }

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ error: 'Unexpected model response structure' }, { status: 500 });
    }

    const topPrediction = result[0];
    return NextResponse.json({ breed: topPrediction.label });

  } catch (error) {
    console.error('Breed prediction error:', error);
    return NextResponse.json({ error: 'Failed to predict breed' }, { status: 500 });
  }
}
