import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona'
import { addMultiplePersonas } from '../../../../db/queries';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const res = await request.json();
  const { collectionSize, personaFeatures, test_prob, coreId } = res;
  const sys_prompt = `You are a really professional persona creator. 
                      You will be asked to generate personas for a specific product testing task.
                      Please generate a persona based on the given requirements.`;

  let history_messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
    { role: 'system', content: sys_prompt },
    { role: "user", content: `For the software product with the testing problem described below, create a virtual persona that has the personaFeatures of ${personaFeatures}. Given product and testing problem: ${test_prob}.` }
  ];

  let generate_result: Persona[] = [];
  for (let i = 0; i < collectionSize; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: history_messages,
        tools: [
          {
            "type": "function",
            "function": {
              "name": "createpersona",
              "description": "Create a virtual persona based on the given personaFeatures.",
              "parameters": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the persona."
                  },
                  "age": {
                    "type": "integer",
                    "description": "Age of the persona."
                  },
                  "gender": {
                    "type": "string",
                    "description": "Gender of the persona. (can be non-binary)"
                  },
                  "occupation": {
                    "type": "string",
                    "description": "Occupation of the persona."
                  },
                  "location": {
                    "type": "string",
                    "description": "Location of the persona."
                  },
                  "characteristic": {
                    "type": "string",
                    "description": "A detailed description of the persona's characteristic, around 200 words. Should describe the persona's background, experience, and personality."
                  },
                  "experience": {
                    "type": "boolean",
                    "description": "True if the persona has experience in using the product, otherwise False."
                  }
                },
                "required": ["name", "age", "gender", "occupation", "location", "characteristic", "experience"]
              }
            }
          }
        ],
        temperature: 0,
        tool_choice: 'auto'
      });

      const new_persona = response?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;

      if (new_persona) {
        history_messages.push(
          { role: 'assistant', content: new_persona },
          {
            role: 'user',
            content: `Keep generating personas for the product testing task. Remember the personaFeatures ${personaFeatures} and the testing problem: ${test_prob}.`
          }
        );

        const persona_obj = JSON.parse(new_persona);
        persona_obj.coreId = coreId;  // Add coreId to the persona
        generate_result.push(persona_obj);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }

  try {

    await addMultiplePersonas(generate_result);

    return NextResponse.json({ personas: generate_result }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: 'Failed to generate personas from OpenAI' }, { status: 500 });
  }
}