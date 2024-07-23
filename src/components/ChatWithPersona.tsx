// src/components/ChatWithPersona.tsx

// Import necessary modules from React and Next.js Image component
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Define the interface for ChatWithPersonaProps
interface ChatWithPersonaProps {
  isOpen: boolean;
  onClose: () => void;
  personaName: string;
}

// Define the interface for ChatMessage
interface ChatMessage {
  sender: 'user' | 'persona';
  message: string;
}

// Define the ChatWithPersona functional component
const ChatWithPersona: React.FC<ChatWithPersonaProps> = ({ isOpen, onClose, personaName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);

    // Update the initial position and size
    const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 620 });
    const [size, setSize] = useState({ width: 400, height: 600 });
  
    // Effect to handle mouse move and mouse up events for dragging the chat window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && chatRef.current) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - chatRef.current.offsetWidth, position.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - chatRef.current.offsetHeight, position.y + dy))
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  // Handle mouse down event to initiate dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: 'user', message: inputMessage }]);
      setInputMessage('');
      // Here you would typically call an API to get the persona's response
      // For now, we'll just simulate a response after a short delay
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'persona', message: `Response from ${personaName}` }]);
      }, 1000);
    }
  };

  // Return null if the chat window is not open
  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed bg-[#333] rounded-lg shadow-lg flex flex-col"
      style={{ width: `${size.width}px`, height: `${size.height}px`, top: position.y, left: position.x }}
    >
      <div className="bg-[#635BFF] p-2 rounded-t-lg cursor-move flex justify-between items-center" onMouseDown={handleMouseDown}>
        <span className="text-white font-semibold">Ask personas</span>
        <div className="flex items-center">
          <button className="text-white mr-2">
            <Image src="/drawer-header-more.svg" alt="More" width={16} height={16} />
          </button>
          <button className="text-white" onClick={onClose}>
            <Image src="/drawer-header-cancel.svg" alt="Close" width={16} height={16} />
          </button>
        </div>
      </div>
      <div className="p-4 border-b border-gray-600">
        <h2 className="text-white text-xl font-bold">{personaName}</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4 bg-gray-800">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="text-sm text-gray-400">{msg.sender === 'user' ? 'Me' : personaName}</span>
            <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-[#625AFA] text-white' : 'bg-gray-700 text-white'}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#333]">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask any questions related to the usability testing!"
            className="flex-grow p-2 rounded-l-lg bg-[#4E4E4E] text-white border border-[#505050]"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#635BFF] text-white p-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the ChatWithPersona component as the default export
export default ChatWithPersona;

