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
  console.log("POST request to /api/generate");
  const res = await request.json();
  const { number, feature, test_prob, temp } = res;
  const sys_prompt = `You are a really professional persona creator. 
                      You will be asked to generate personas for a specific product testing task.
                      Please generate a persona based on the given requirements.`;

  let history_messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
    { role: 'system', content: sys_prompt },
    { role: "user", content: `For the software product with the testing problem described below, create a virtual persona that has the feature of ${feature}. Given product and testing problem: ${test_prob}.` }
  ];

  let generate_result = [];
  for (let i = 0; i < number; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: history_messages,
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
                gender: {
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
                  description: "A detailed description of the persona's characteristic, around 200 words. Should describe the persona's background, experience, and personality."
                },
                experience: {
                  type: "boolean",
                  description: "True if the persona has experience in using the product, otherwise False."
                }
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
        history_messages.push(
          { role: 'assistant', content: new_persona },
          {
            role: 'user',
            content: `Keep generating personas for the product testing task. Remember the feature ${feature} and the testing problem: ${test_prob}.`
          }
        );

        const persona_obj = JSON.parse(new_persona);
        generate_result.push(persona_obj);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }

  try {
    return NextResponse.json({ personas: generate_result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate personas from OpenAI' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const res = await request.json();
  const { id, name, occupation, age, gender, experience, location, characteristic } = res;
  // TODO: Implement the database update logic here

  return NextResponse.json({ message: 'Update functionality not implemented yet' }, { status: 500 });
}

export async function DELETE(request: Request) {
  const res = await request.json();
  const { id } = res;
  // TODO: Implement the database delete logic here

  return NextResponse.json({ message: 'Delete functionality not implemented yet' }, { status: 500 });
}

//@Daniel
// const task = "";
// const persona_description = "";
// const task_instruction_prompt= 
//     `Now you are using the app, the interface you are seeing is provide in the image,\
//     remember that your ultimate goal of using this app is: ${task}.\
//     Tell me what you will do with this interface to complete the ultimate task.\
//     Your response can be either:\
//       a. click the button/ toggle swith\
//       b. sroll up\
//       c. sroll down\
//     when you choose the option, please describe the touchpoint location in detailed\
//     and provide a reason for your choice.`;

// const ask_response_prompt = 
//     "Now you are navigating to this page after your previous action, what will you do next?\
//     Your response can be either:\
//       a. click the button/ toggle swith\
//       b. sroll up\
//       c. sroll down\
//     when you choose the option, please describe the touchpoint location in detailed and provide a reason for your\ choice."

// const ask_do_again_prompt =
//     "Sorry, your action might be a wrong decision to complete the task, please try again."

// let initial_messages = [ 
//   { role: "system", 
// 	  content: `You are a professional human simulation robot, with given a persona description, you should try to\ simulate that person. Then take action/response regarding tha task provided by user, you should make action\ decision based on the persona features and your own imagination and prediction.\
//     Here is the given persona information: ${persona_description}`
//   },
//   { role: "user",
//     constent: task_instruction_prompt}
// ]

// // everytime the user provide a response, you should either push an ask_response_prompt or ask_try_again_prompt to the intial_messages list

