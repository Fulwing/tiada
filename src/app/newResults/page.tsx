'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TestResult } from '../../types/test/result';
import { HeuristicsData } from '../../types/heuristics';
import NewOverallEvaluation from '../../components/newResults/NewOverallEvaluation';
import NewUserJourney from '../../components/newResults/NewUserJourney';
import { isTestResult } from '../../lib/utils/helper/typecheck/result';
import NavigationBar from '../../components/NavigationBar';
import HexagonHIcon from '../../components/newResults/HIcon';
import ExpandedSidebar from '../../components/newResults/ExpandedSidebar';
import ChatWithPersona from '../../components/ChatWithPersona';

export default function NewResultsPage() {
  const [data, setData] = useState<TestResult[] | null>(null);
  const [heuristicsData, setHeuristicsData] = useState<HeuristicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedJourneyId, setExpandedJourneyId] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedSidebarTab, setSelectedSidebarTab] = useState<'overall' | 'heuristics' | 'testingActivity' | 'download' | 'persona'>('overall');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPersonaId, setChatPersonaId] = useState<string | null>(null);
  const [chatPersonaName, setChatPersonaName] = useState<string>('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsResponse = await fetch('/api/results?userId=1');
        const heuristicsResponse = await fetch('/api/mock/heuristics');
        
        if (!resultsResponse.ok || !heuristicsResponse.ok) {
          throw new Error(`HTTP error! Status: ${resultsResponse.status} ${heuristicsResponse.status}`);
        }
        
        const resultsData = await resultsResponse.json();
        const heuristicsData = await heuristicsResponse.json();
        
        if (Array.isArray(resultsData) && resultsData.every(isTestResult)) {
          setData(resultsData);
        } else {
          throw new Error('Invalid data structure received from API');
        }
        
        setHeuristicsData(heuristicsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = (journeyId: string) => {
    setExpandedJourneyId(expandedJourneyId === journeyId ? null : journeyId);
  };

  const handleToggleSidebar = (tab: 'overall' | 'heuristics' | 'testingActivity' | 'download' | 'persona') => {
    if (isSidebarExpanded && selectedSidebarTab === tab) {
      setIsSidebarExpanded(false);
    } else {
      setIsSidebarExpanded(true);
      setSelectedSidebarTab(tab);
    }
    setSelectedPersonaId(null);
    setSelectedJourneyId(null);
  };

  const handleCheckPersonaInfo = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setSelectedSidebarTab('persona');
    setIsSidebarExpanded(true);
  };

  const handleViewTestingDetails = (journeyId: string) => {
    setSelectedJourneyId(journeyId);
    setSelectedSidebarTab('testingActivity');
    setIsSidebarExpanded(true);
  };

  const handleTalkWithPersona = (personaId: string, personaName: string) => {
    setChatPersonaId(personaId);
    setChatPersonaName(personaName);
    setIsChatOpen(true);
  };

  const handleCloseChatWithPersona = () => {
    setIsChatOpen(false);
    setChatPersonaId(null);
    setChatPersonaName('');
  };


  if (loading) return <p className="p-6 text-[#7D7D7D]">Loading...</p>;
  if (error) return <p className="p-6 text-[#FF4848]">Error: {error}</p>;
  if (!data || data.length === 0) return <p className="p-6 text-[#7D7D7D]">No data available.</p>;

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <NavigationBar />
      <div className="flex flex-1">
        <main className={`flex-1 p-6 overflow-auto ${isSidebarExpanded ? 'mr-[375px]' : 'mr-16'}`}>
          <NewOverallEvaluation results={data} />
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <Image src="/checklist-24.svg" alt="Checklist" width={24} height={24} className="mr-2" />
              <h2 className="text-xl font-semibold text-white">Task Completion Details</h2>
            </div>
            <div className="bg-[#1C1D1F] p-4 rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#7D7D7D] bg-[#1C1D1F]">
                      <th className="p-2">#</th>
                      <th className="p-2">Completion</th>
                      <th className="p-2">Steps Taken</th>
                      <th className="p-2">Wrong times</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Experience</th>
                      <th className="p-2">Age</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Occupation</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Education Level</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((result, index) => (
                      <NewUserJourney
                        key={result.id}
                        result={result}
                        index={index + 1}
                        isExpanded={expandedJourneyId === result.id}
                        onToggleExpand={() => handleToggleExpand(result.id!)}
                        onCheckPersonaInfo={handleCheckPersonaInfo}
                        onViewTestingDetails={handleViewTestingDetails}
                        onTalkWithPersona={handleTalkWithPersona}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <aside className={`w-16 bg-[#1C1D1F] flex flex-col items-center py-4 space-y-6 fixed right-0 top-14 bottom-0 ${isSidebarExpanded ? 'mr-[375px]' : ''}`}>
          <button onClick={() => handleToggleSidebar('overall')}>
            <Image src="/align-justify.svg" alt="Menu" width={24} height={24} />
          </button>
          <Image src="/trending-up.svg" alt="Analytics" width={24} height={24} />
          <button onClick={() => handleToggleSidebar('testingActivity')}>
            <Image src="/Icon2.svg" alt="Testing Activity" width={24} height={24} />
          </button>
          <button onClick={() => handleToggleSidebar('heuristics')}>
            <HexagonHIcon />
          </button>
          <button onClick={() => handleToggleSidebar('persona')}>
            <Image src="/Users1.svg" alt="Users" width={24} height={24} />
          </button>
          <button onClick={() => handleToggleSidebar('download')}>
            <Image src="/download.svg" alt="Download" width={24} height={24} />
          </button>
          </aside>
        {isSidebarExpanded && (
          <ExpandedSidebar
            results={data || []}
            onClose={() => setIsSidebarExpanded(false)}
            selectedTab={selectedSidebarTab}
            heuristicsData={heuristicsData}
            selectedPersonaId={selectedPersonaId}
            selectedJourneyId={selectedJourneyId}
          />
        )}
      </div>
      {isChatOpen && chatPersonaId && (
        <ChatWithPersona
          isOpen={isChatOpen}
          onClose={handleCloseChatWithPersona}
          personaName={chatPersonaName}
          personaId={chatPersonaId}
        />
      )}
    </div>
  );
}


