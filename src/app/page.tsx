'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [transition, setTransition] = useState(false);
  const [submitTransition, setSubmitTransition] = useState(false);
  const [userId, setUserId] = useState('');

  const handleStartTestingClick = () => {
    setShowCanvas(true);
    setTimeout(() => setTransition(true), 10);
  };

  const handleCloseCanvasClick = () => {
    setTransition(false);
    setTimeout(() => setShowCanvas(false), 500);
  };

  useEffect(() => {
    if (showCanvas) {
      setTimeout(() => setTransition(true), 10);
    }
  }, [showCanvas]);

  const handleSubmitClick = () => {
    localStorage.setItem('userId', userId); // Save user ID to localStorage
    setSubmitTransition(true);
    setTimeout(() => {
      window.location.href = '/steps';
    }, 1000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 p-4">
      {!showCanvas && (
        <>
          <h1 className="text-8xl font-extrabold text-white text-center mb-2">
            TIADA
          </h1>
          <p className="text-2xl text-white font-light text-center">
            Usability Testing with AI
          </p>
          <Link href="/about">
            <button className=" w-48 mt-8 px-6 py-3 bg-white text-blue-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all">
              Learn More
            </button>
          </Link>
          <button
            onClick={handleStartTestingClick}
            className=" w-48 mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all"
          >
            Start Testing
          </button>
        </>
      )}

      {showCanvas && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gradient-to-b from-white to-gray-300 transition-opacity duration-500 ease-in-out ${transition ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={handleCloseCanvasClick}
              className="text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div
            className={`flex flex-col items-center p-8 bg-white rounded-lg shadow-2xl transform transition-transform duration-500 ease-in-out ${transition ? 'scale-100' : 'scale-95'
              } ${submitTransition ? 'hidden' : 'block'}`}
          >
            <label className="text-2xl text-gray-800 mb-4">Enter Your Core ID:</label>
            <input
              type="text"
              className="px-4 py-2 mb-4 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              onClick={handleSubmitClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:bg-gradient-to-l transition-all transform hover:scale-105"
            >
              Submit
            </button>
          </div>
          {submitTransition && (
            <div className="flex flex-col items-center justify-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
              <p className="text-2xl text-gray-800">Logging you in...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
