import React from 'react';

export default function Page() {
  const results = ["Test Result 1", "Test Result 2"];

  return (
    <div>
      <h1>Test Results</h1>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};