import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import  connectToDB  from '@/lib/mongodb';
import Pet from '@/models/Pets';
import axios from 'axios';

export async function GET() {
  try {
    const { userId } = await auth(); // ✅ await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    // Get the first pet of the user
    const pet = await Pet.findOne({ userId });

    if (!pet) {
      return NextResponse.json({
        tips: ["Add a pet profile to receive personalized breed tips."]
      });
    }

    const prompt = `Give 4 short and helpful pet care tips specifically for a ${pet.breed} in bullet points without numbering.(dont start with bullets or anything in any sentence/any tip)`;

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', 
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tipsRaw = response.data.choices?.[0]?.message?.content || '';

   const tips = tipsRaw
  .split('\n')
  .map((line: string) => line.replace(/^\-|\d+\./, '').trim())
  .filter((tip: string) => tip.length > 3);


    return NextResponse.json({ tips });

  } catch (error) {
    console.error('Error in /api/tips route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
