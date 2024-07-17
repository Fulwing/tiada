// pages/index.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 p-4">
      <h1 className="text-8xl font-extrabold text-white text-center mb-2">
        TIADA
      </h1>
      <p className="text-2xl text-white font-light text-center">
        Usability Testing with AI
      </p>
      <Link href="/about">
        <button className="mt-8 px-6 py-3 bg-white text-blue-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all">
          Learn More
        </button>
      </Link>
    </div>
  );
};
