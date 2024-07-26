'use client'

import { useState } from 'react';

const Chat = () => {
    const [personaId, setPersonaId] = useState('');
    const [userText, setUserText] = useState('');
    const [responseText, setResponseText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setResponseText('');

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ personaId, userText }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseText(data.personaText);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred while processing your request.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Chat with Persona</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="personaId" className="block text-sm font-medium text-gray-700">Persona ID:</label>
                        <input
                            type="text"
                            id="personaId"
                            value={personaId}
                            onChange={(e) => setPersonaId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="userText" className="block text-sm font-medium text-gray-700">Your Message:</label>
                        <input
                            type="text"
                            id="userText"
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Send
                    </button>
                </form>
                {responseText && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        <h2 className="text-lg font-semibold">Response:</h2>
                        <p>{responseText}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <h2 className="text-lg font-semibold">Error:</h2>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
