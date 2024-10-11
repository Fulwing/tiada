import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Log the received data
      console.log('Received annotation data:', req.body);

      // Here you would typically send the data to Daniel's backend
      // For now, we'll just simulate a successful response

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send a success response
      res.status(200).json({ message: 'Data received and processed successfully' });
    } catch (error) {
      console.error('Error processing annotation data:', error);
      res.status(500).json({ message: 'Error processing annotation data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

