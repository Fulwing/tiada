import { NextResponse } from 'next/server';
import Persona from '../../../../types/test/persona';
import { addMultiplePersonas } from '../../../../db/queries';
import OpenAI from 'openai';
import { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions';

// Define OpenAI client with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const { collectionSize, personaFeatures, test_prob, coreId } = res;

    const sys_prompt = `You are a highly professional persona creator.
                        You will be asked to generate multiple personas for a specific product testing task.
                        Please generate ${collectionSize} personas based on the following requirements.`;

    const user_prompt = `For the software product with the testing problem described below, create ${collectionSize} virtual personas that have the persona features of ${personaFeatures}. Given product and testing problem: ${test_prob}.`;

    // Define the tool (function) structure
    const tool_definition = {
      type: 'function' as const,
      function: {
        name: 'create_personas',
        description: 'Create multiple virtual personas based on the given personaFeatures.',
        parameters: {
          type: 'object',
          properties: {
            personas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the persona.',
                  },
                  age: {
                    type: 'integer',
                    description: 'Age of the persona.',
                  },
                  gender: {
                    type: 'string',
                    description: 'Gender of the persona (can be non-binary).',
                  },
                  occupation: {
                    type: 'string',
                    description: 'Occupation of the persona.',
                  },
                  location: {
                    type: 'string',
                    description: 'Location of the persona.',
                  },
                  characteristic: {
                    type: 'string',
                    description:
                      "A detailed description of the persona's characteristics, around 200 words. Should describe the persona's background, experience, and personality.",
                  },
                  experience: {
                    type: 'boolean',
                    description:
                      'True if the persona has experience in using the product, otherwise False.',
                  },
                },
                required: [
                  'name',
                  'age',
                  'gender',
                  'occupation',
                  'location',
                  'characteristic',
                  'experience',
                ],
              },
            },
          },
          required: ['personas'],
        },
      },
    };

    // Define the tool_choice correctly
    const tool_choice = {
      type: 'function' as const,
      function: {
        name: 'create_personas',
      },
    };

    // Use the correct type for messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: sys_prompt },
      { role: 'user', content: user_prompt },
    ];

    // Create the chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0613',
      messages: messages,
      tools: [tool_definition],
      tool_choice: tool_choice,
      temperature: 0,
    });

    // Access the tool call results based on the provided interface
    const tool_call: ChatCompletionMessageToolCall | undefined =
      response.choices[0].message?.tool_calls?.[0];

    if (tool_call && tool_call.function && tool_call.function.arguments) {
      // Parse the function arguments (should be in JSON format)
      const function_arguments = JSON.parse(tool_call.function.arguments);

      // Validate the parsed arguments
      if (
        !function_arguments.personas ||
        !Array.isArray(function_arguments.personas)
      ) {
        throw new Error('Invalid persona data received from OpenAI.');
      }

      // Add coreId to each persona
      const generated_personas: Persona[] = function_arguments.personas.map(
        (persona: any) => ({
          ...persona,
          coreId,
        })
      );

      // Save the generated personas to the database
      await addMultiplePersonas(generated_personas);

      return NextResponse.json({ personas: generated_personas }, { status: 200 });
    } else {
      throw new Error('Tool call failed or returned no arguments.');
    }
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate personas from OpenAI' },
      { status: 500 }
    );
  }
}
