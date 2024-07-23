import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request
) {
  const res = await request.json();
  const { number, age, story } = res;
  //const prompt = `Create a detailed persona for a character named ${name}, age ${age}, who ${story}`;
  const sys_prompt = "You are persona creator. Please generate a persona based on the given feature.";

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: sys_prompt },
        { role: "user", content: "For the product:instagram, Create a virtual persona"}
      ],
      functions: [
        {
          name: "createpersona",
          description: "Create a virtual persona based on the given feature.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the persona."
              },
              age: {
                  type: "integer",
                  description: "Age of the persona."
              },
              gender:{
                  type: "string",
                  description: "Gender of the persona. (can be non-binary)"
              },
              occupation: {
                  type: "string",
                  description: "Occupation of the persona."
              },
              location: {
                type: "string",
                description: "Location of the persona."
              },
              characteristic: {
                type: "string",
                description: "A around 150 words description of the persona's characteristic."
              },
            }
          }
        }
      ],
      function_call: "auto",
    });
    const new_persona = response.choices[0].message.function_call?.arguments;
    console.log(new_persona);
    if (new_persona) {
      const persona_obj = JSON.parse(new_persona);
      return Response.json({ persona: persona_obj }, { status: 200 });
    }

    //return Response.json({ persona: response.choices[0].message.function_call?.arguments }, { status: 200 });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return Response.json({ error: 'Failed to generate persona from OpenAI' }, { status: 500 });
  }
}
