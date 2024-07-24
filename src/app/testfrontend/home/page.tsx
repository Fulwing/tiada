import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <Head>
        <title>The Future of Usability Testing with TIADA</title>
        <meta name="description" content="AI-powered persona and scenario generation, along with data-driven insights, streamline testing in your Agile workflows." />
      </Head>
      <div className="absolute inset-0 z-0">
        <Image src="/homebackground.png" alt="Background" layout="fill" objectFit="cover" />
      </div>
      <div className="relative z-10 flex flex-col items-start w-full max-w-4xl px-4">
        <div className="w-1/3 ml-auto">
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold mb-4">The Future of Usability Testing with TIADA</h1>
            <p className="text-lg mb-8">
              AI-powered persona and scenario generation, along with data-driven insights, streamline testing in your Agile workflows.
            </p>
            <div className="flex justify-start space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Test with demo</button>
              <button className="bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}