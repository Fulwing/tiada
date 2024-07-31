'use client';

import { useState } from 'react';

const Upload = () => {
  const [picture, setPicture] = useState<File | null>(null);
  const [markedPicture, setMarkedPicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [id, setId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!picture || !markedPicture) {
      setMessage('Please select both images');
      return;
    }

    const formData = new FormData();
    formData.append('picture', picture);
    formData.append('markedPicture', markedPicture);

    const res = await fetch('/api/node/addNode', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message);
    setId(result.id);
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="picture">Picture:</label>
          <input
            type="file"
            id="picture"
            accept="image/*"
            onChange={(e) => setPicture(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div>
          <label htmlFor="markedPicture">Marked Picture:</label>
          <input
            type="file"
            id="markedPicture"
            accept="image/*"
            onChange={(e) => setMarkedPicture(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {id && <p>Uploaded Image ID: {id}</p>}
    </div>
  );
};

export default Upload;
