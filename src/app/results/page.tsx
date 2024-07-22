// src/app/results/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define interfaces for data structures
interface StepDetail {
  stepNumber: number;
  status: 'success' | 'miss';
  description?: string;
}

interface TestResult {
  id: number;
  taskCompletion: string;
  steps: number;
  name: string;
  gender: string;
  age: number;
  occupation: string;
  stepDetails: StepDetail[];
  persona?: string;
}

// Component to render the step completion visualization
function StepCompletion({ steps }: { steps: StepDetail[] }) {
    let missCount = 0;
    return (
        <div className="flex items-center relative">
            {steps.map((step, index) => {
                if (step.status === 'miss') missCount++;
                return (
                    <div key={step.stepNumber} className="flex flex-col items-center" style={{ width: '60px', position: 'relative' }}>
                        <div className="flex items-center justify-center" style={{ width: '60px', height: '20px' }}>
                            {index > 0 && (
                                <div 
                                    className={`h-0.5 absolute ${step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'}`} 
                                    style={{
                                        width: '60px',
                                        left: '-30px',
                                        top: '10px',
                                        zIndex: 1
                                    }}
                                ></div>
                            )}
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    step.status === 'success' ? 'bg-[#02FF2B]' : 'bg-[#FF4848]'
                                }`}
                                style={{ zIndex: 2, position: 'relative' }}
                            ></div>
                        </div>
                        <span 
                            className={`text-[13px] font-light ${step.status === 'success' ? 'text-[#7D7D7D]' : 'text-[#FF6666]'} transform -rotate-45 mt-4`} 
                            style={{ whiteSpace: 'nowrap', position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }}
                        >
                            {step.status === 'success' ? `Stage ${step.stepNumber}` : `Miss ${missCount}`}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// Component to render an individual user journey
function UserJourney({ result }: { result: TestResult }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-[#333333] rounded-lg mb-4">
            <div className="flex cursor-pointer p-4" onClick={() => setExpanded(!expanded)}>
                <span className="w-[22%] text-[#7D7D7D]">{result.taskCompletion}</span>
                <span className="w-[13%] text-[#7D7D7D]">{result.steps}</span>
                <span className="w-[17%] text-[#7D7D7D]">{result.name}</span>
                <span className="w-[15%] text-[#7D7D7D]">{result.gender}</span>
                <span className="w-[13%] text-[#7D7D7D]">{result.age}</span>
                <span className="w-[20%] text-[#7D7D7D]">{result.occupation}</span>
            </div>
            {expanded && (
                <div className="mt-4 text-[#7D7D7D] flex p-4">
                    <div className="flex-1">
                        <div className="ml-4 mb-20">
                            <StepCompletion steps={result.stepDetails} />
                        </div>
                        <div className="ml-4 mt-8">
                            {result.stepDetails.filter(step => step.status === 'miss').map((step, index) => (
                                <div key={step.stepNumber} className="mt-2">
                                    {step.description && (
                                        <p className="text-[#FF4848] text-[18px]">
                                            <span className="font-semibold">Miss {index + 1}:</span> {step.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-8">
                        <button className="bg-[#333333] text-[#7D7D7D] px-4 py-2 rounded w-[176px] text-[18px] border border-[#505050]" onClick={() => alert(result.persona)}>
                            Check Persona
                        </button>
                        <button className="bg-[#333333] text-[#7D7D7D] px-4 py-2 rounded w-[176px] text-[18px] border border-[#505050]" onClick={() => alert("Full details would be shown here")}>
                            See full details
                        </button>
                        <button className="bg-[#333333] text-[#7D7D7D] px-4 py-2 rounded w-[176px] text-[18px] border border-[#505050]" onClick={() => alert(`Talking with ${result.name}`)}>
                            Talk with {result.name}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main ResultsPage component
export default function ResultsPage() {
    const [data, setData] = useState<TestResult[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch data from the API when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const response = await fetch('/api/results');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setLoading(false);
        }
    };

    // Function to sort the data based on the number of failures
    const sortData = () => {
        if (data) {
            const sortedData = [...data].sort((a, b) => {
                const aFailures = a.stepDetails.filter(step => step.status === 'miss').length;
                const bFailures = b.stepDetails.filter(step => step.status === 'miss').length;
                return sortOrder === 'asc' ? aFailures - bFailures : bFailures - aFailures;
            });
            setData(sortedData);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
    };

    if (loading) return <p className="p-6 text-[#7D7D7D]">Loading...</p>;
    if (error) return <p className="p-6 text-[#FF4848]">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-[#272728] text-[#7D7D7D] flex">
            <main className="flex-1 p-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Image src="/flag.svg" alt="Flag" width={24} height={24} className="mr-2" />
                            <h2 className="text-xl font-semibold text-[#FFFFFF]">Task completion</h2>
                        </div>
                        <button onClick={sortData}>
                            <Image src="/sort.svg" alt="Sort" width={20} height={24} />
                        </button>
                    </div>
                    <div className="flex items-center text-[#FFFFFF] p-4 rounded-md mb-4">
                        <span className="w-[22%] font-bold">Task Completion</span>
                        <span className="w-[13%] font-bold">Steps</span>
                        <span className="w-[17%] font-bold">Name</span>
                        <span className="w-[15%] font-bold">Gender</span>
                        <span className="w-[13%] font-bold">Age</span>
                        <span className="w-[20%] font-bold">Occupation</span>
                    </div>
                </div>
                {data && data.map((result) => (
                    <UserJourney key={result.id} result={result} />
                ))}
            </main>
            <div className="w-1/4 p-4">
                <div className="flex items-center mt-2">
                    <span className="mr-2 text-[18px] text-[#FFFFFF]">Suggestions for user testing</span>
                    <Image src="/help-message.svg" alt="Chat" width={24} height={24} />
                </div>
                {/* Add content for suggestions here */}
            </div>
        </div>
    );
}

