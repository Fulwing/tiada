'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type NodeProps = {
  id: number;
  picture: string;
  markedPicture: string;
  createdAt: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const [node, setNode] = useState<NodeProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeById = async (id: string) => {
      try {
        const res = await fetch(`/api/node/getNode/${id}`);
        if (!res.ok) {
          throw new Error('Node not found');
        }

        const data = await res.json();
        const node: NodeProps = {
          id: data.id,
          picture: `data:image/jpeg;base64,${data.picture}`,
          markedPicture: `data:image/jpeg;base64,${data.markedPicture}`,
          createdAt: data.createdAt,
        };

        setNode(node);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNodeById(params.id);
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!node) {
    return <div>Node not found</div>;
  }

  return (
    <div>
      <h1>Node Details</h1>
      <div>
        <h2>Picture</h2>
        <Image
          src={node.picture}
          alt="Picture"
          width={200}
          height={200}
          objectFit="contain"
        />
        <h2>Marked Picture</h2>
        <Image
          src={node.markedPicture}
          alt="Marked Picture"
          width={200}
          height={200}
          objectFit="contain"
        />
        <p>Created At: {node.createdAt}</p>
      </div>
    </div>
  );
}
