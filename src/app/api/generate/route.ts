import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request
) {
  const res = await request.json();
  const { name, age, story } = res;
  const prompt = `Create a detailed persona for a character named ${name}, age ${age}, who ${story}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
    });

    return Response.json({ persona: response.choices[0].message.content }, { status: 200 });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return Response.json({ error: 'Failed to generate persona from OpenAI' }, { status: 500 });
  }
}
