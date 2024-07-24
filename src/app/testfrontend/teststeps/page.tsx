'use client'

import { useState } from 'react';

const Home = () => {
    const [jobDetails, setJobDetails] = useState('');
    const [screenshotIds, setScreenshotIds] = useState<string>('');
    const [results, setResults] = useState<number[]>([]);
    const [conversationHistory, setConversationHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      setResults([]);
      setConversationHistory([]);
  
      try {
        const idsArray = screenshotIds.split(',').map(id => id.trim());
  
        const response = await fetch('/api/ai/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDetails,
            screenshots: idsArray,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to start usability test');
        }
  
        const data = await response.json();
        setResults(data.results);
        setConversationHistory(data.conversationHistory);
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="max-w-3xl mx-auto p-6 font-sans">
        <h1 className="text-3xl font-bold text-center mb-6">Usability Test</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobDetails">Job Details:</label>
            <textarea
              id="jobDetails"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobDetails}
              onChange={(e) => setJobDetails(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="screenshotIds">Screenshots IDs (comma separated):</label>
            <input
              id="screenshotIds"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={screenshotIds}
              onChange={(e) => setScreenshotIds(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Start Usability Test'}
            </button>
          </div>
        </form>
        {results.length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <ul className="list-disc pl-5">
              {results.map((result, index) => (
                <li key={index} className={`mb-2 ${result === 1 ? 'text-green-500' : 'text-red-500'}`}>
                  Step {index + 1}: {result === 1 ? 'Correct' : 'Incorrect'}
                </li>
              ))}
            </ul>
          </div>
        )}
        {conversationHistory.length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Conversation History</h2>
            <ul className="list-disc pl-5">
              {conversationHistory.map((message, index) => (
                <li key={index} className="mb-2">
                  <strong>{message.role}:</strong> {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default Home;
