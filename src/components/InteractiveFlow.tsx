import React, { useState, useCallback, ChangeEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ImageUploadNode from './ImageUploadNode';

interface FlowElement extends Node {
  data: { label: string };
}

interface Edge {
    id: string;
    source: string;
    target: string;
    animated: boolean;
}

const initialNodes: FlowElement[] = [
  { id: '1', position: { x: 100, y: 0 }, data: { label: 'Start Node' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'End Node' } },
];

const nodeTypes = { uploadImage: ImageUploadNode };


const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

function FlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeDesc, setNodeDesc] = useState('');

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = useCallback(() => {
    const newNode: FlowElement = {
      type: 'uploadImage',
      id: `node_${nodes.length + 1}`,
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: `${nodeName}: ${nodeDesc}` }
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
    setNodeDesc('');
  }, [nodes.length, nodeName, nodeDesc, setNodes]);

  return (
    <div className="pb-20 pt-2 pl-5 w-full">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Node Name"
          value={nodeName}
          className="input input-bordered input-primary w-full max-w-xs"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNodeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={nodeDesc}
          className="input input-bordered input-primary w-full max-w-xs"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNodeDesc(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addNode}>
          Add Node
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ height: 500}}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default FlowComponent;
