import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { prompt } = req.body;
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Update model version
      messages: [{ role: 'user', content: prompt }],
    });

    res.status(200).json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}
