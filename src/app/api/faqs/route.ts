import { NextRequest, NextResponse } from 'next/server'
import Pet from '@/models/Pets'
import { auth } from '@clerk/nextjs/server'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ faqs: [] })

    const pet = await Pet.findOne({ userId })
    if (!pet?.breed) return NextResponse.json({ faqs: [] })

    const prompt = `Give 3 frequently asked questions (with short helpful answers) about pet care specifically for a ${pet.breed}. Return in format:
- Question: ...
  Answer: ...
- Question: ...
  Answer: ...
- Question: ...
  Answer: ...
`

    const togetherRes = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const togetherData = await togetherRes.json()
    const rawText = togetherData.choices?.[0]?.message?.content || ''

    // ✅ Use regex to extract Q/A pairs flexibly
    const faqMatches = [...rawText.matchAll(/[-*]\s*Question:\s*([\s\S]*?)\s*Answer:\s*([\s\S]*?)(?=(?:[-*]\s*Question:|$))/g)]


    const faqs = faqMatches.map(match => ({
      question: match[1].trim(),
      answer: match[2].trim(),
    }))

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('FAQ API Error:', error)
    return NextResponse.json({ faqs: [] })
  }
}
