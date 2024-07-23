/**
 * PREVIOUS CODE
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
*/

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Persona {
  id: number;
  name: string;
  occupation: string;
  age: number;
  gender: string;
  experience: boolean;
  location: string;
  characteristic: string;
}

export async function GET() {
    const mockPersonas: Persona[] = [
        {
            id: 1,
            name: "Samantha Parker",
            occupation: "Digital Marketing Specialist",
            age: 29,
            gender: "Female",
            experience: true,
            location: "San Francisco, California",
            characteristic: "Samantha Parker is an innovative, modern-day digital marketer residing in the heart of San Francisco. With her finger constantly on the pulse of the latest trends, she uses Instagram as a crucial part of her marketing strategies. Known for her vibrant and artistic posts, Samantha combines her deep love for aesthetics with analytical rigor to create compelling content that boosts engagement and drives brand awareness. Her profile is a colorful mix of professional insights, trending hashtags, and personal anecdotes, providing her followers with a well-rounded and engaging experience. On weekends, Samantha enjoys exploring the city's vibrant arts and food scene, often sharing these adventures on her Instagram Stories."
        },
        {
            id: 2,
            name: "Michael Chen",
            occupation: "Software Engineer",
            age: 34,
            gender: "Male",
            experience: true,
            location: "Seattle, Washington",
            characteristic: "Michael Chen is a seasoned software engineer with a passion for cutting-edge technologies. Based in Seattle's tech hub, he specializes in cloud computing and machine learning applications. Michael's analytical mind and problem-solving skills make him an asset in developing robust, scalable solutions for complex business challenges. Outside of work, he's an avid hiker and nature photographer, often using his technical skills to develop apps that enhance outdoor experiences. Michael is known for his ability to bridge the gap between technical complexities and user-friendly designs, making him a valuable team member in cross-functional projects."
        }
    ];

    console.log("GET request to /api/generate");
    return NextResponse.json(mockPersonas);
}

export async function POST(request: Request) {
    // TODO: Implement persona generation logic here
    console.log("POST request to /api/generate");
    const res = await request.json();
    //const { number, age, story } = res;
    const {number, feature, test_prob, temp} = res;
    //const prompt = `Create a detailed persona for a character named ${name}, age ${age}, who ${story}`;
    const sys_prompt = "You are a persona creator. You will be asked to generate a few personas for specific product testing task\
                        Please generate a persona based on the given requirements.";
    
    let generate_result = [];
    for (let i=0; i<number; i++){
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: sys_prompt },
            { role: "user", content: `For the software product with testing problem as describe belowed,\
                                      Create a virtual persona that has the feature of ${feature}.\
                                      Given product and testing problem: ${test_prob}.`}
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
                    description: "A around 200 words description of the persona's characteristic. Should be detailed describe the persona's background, experience, and personality."
                  },
                }
              }
            }
          ],
          function_call: "auto",
          temperature: temp,
        });
        const new_persona = response.choices[0].message.function_call?.arguments;
        console.log(new_persona);
        if (new_persona) {
          const persona_obj = JSON.parse(new_persona);
          generate_result.push(persona_obj); //Response.json({ persona: persona_obj }, { status: 200 });
        }
        //return Response.json({ persona: response.choices[0].message.function_call?.arguments }, { status: 200 });
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
        //return Response.json({ error: 'Failed to generate persona from OpenAI' }, { status: 500 });
      }
    }
    Response.json({ personas: generate_result }, { status: 200 });
    //return NextResponse.json({ message: "Persona generation not yet implemented" }, { status: 501 });
}

