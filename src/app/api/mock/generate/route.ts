import { NextRequest, NextResponse } from 'next/server';

function generateMockPersonas(count: number, features: string = '') {
  const personas = [];
  for (let i = 0; i < count; i++) {
    personas.push({
      id: `${i + 1}`,
      name: `Person ${i + 1}`,
      occupation: ['Software Developer', 'UX Designer', 'Product Manager', 'Data Analyst'][Math.floor(Math.random() * 4)],
      age: Math.floor(Math.random() * (65 - 18) + 18),
      gender: ['Male', 'Female', 'Non-binary'][Math.floor(Math.random() * 3)],
      experience: Math.random() > 0.5,
      location: ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'][Math.floor(Math.random() * 5)],
      characteristic: `Characteristic for Person ${i + 1}`,
      coreId: `core${i + 1}`,
      createdAt: new Date(),
      educationLevel: ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'][Math.floor(Math.random() * 4)],
      description: `This is a detailed description for Person ${i + 1}. It includes information about their background, skills, and preferences related to software products. ${features}`
    });
  }
  return personas;
}

export async function GET(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get('collection');

  if (collection === 'MS general client collection') {
    const personas = generateMockPersonas(77);
    return NextResponse.json({ personas });
  }

  // Default response if no specific collection is requested
  const defaultPersonas = generateMockPersonas(10);
  return NextResponse.json({ personas: defaultPersonas });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { collectionName, collectionSize, collectionDescription, personaFeatures } = body;
  
    const count = parseInt(collectionSize) || 10;
    const newPersonas = generateMockPersonas(count, personaFeatures);
  
    // In a real implementation, you would save the collection details and personas to a database here
  
    return NextResponse.json({ 
      personas: newPersonas,
      collection: {
        name: collectionName,
        description: collectionDescription,
        size: count
      }
    });
  }
  
  
  