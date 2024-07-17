import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the AI Testing Platform</h1>
      <nav>
        <ul>
          <li><Link href="/chat">Chat with AI</Link></li>
          <li><Link href="/generate">Generate AI Persona</Link></li>
          <li><Link href="/results">View Results</Link></li>
        </ul>
      </nav>
    </div>
  );
};
