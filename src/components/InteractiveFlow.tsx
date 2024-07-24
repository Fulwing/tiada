import React, {FC, useCallback, useState} from 'react';
import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StepNode from './StepNode';
import {v4 as uuid} from 'uuid'
import Image from 'next/image';
import {toPng} from 'html-to-image';

interface FlowNode {
    parentId: string;
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: { label: string };
}

const downloadNodeImages = async (nodes: FlowNode[]) => {
    for (const node of nodes) {
        if (!node.parentId) {
            const nodeElement = document.querySelector(`.react-flow__node[data-id='${node.id}']`);
            if (nodeElement) {
                const htmlElement = nodeElement as HTMLElement;
                const png = await toPng(htmlElement, {
                    backgroundColor: 'white',
                    width: htmlElement.offsetWidth,
                    height: htmlElement.offsetHeight,
                    style: {
                        transform: `translate(0, 0)`,
                    },
                });
                const a = document.createElement('a');
                a.href = png;
                a.download = `node-${node.id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
};

const DownloadButton: FC = () => {
    const {getNodes} = useReactFlow();
    const onClick = () => {
        const nodes = getNodes().map(node => ({
            ...node,
            data: {
                ...node.data,
                label: 'label' in node.data ? node.data.label : 'Default Label',
            }
        })) as FlowNode[];
        downloadNodeImages(nodes).then(r => {});
    };

    return (
    <button
        className="bg-[#6A6DCD] text-white py-2 px-4 rounded w-80 mt-auto mb-2 m-5"
        onClick={onClick}
        style={{cursor: 'pointer'}}>
        Next
    </button>);
};


interface ToolItemProps {
    name: string;
    onClickEvent: () => void;
}

interface GoalItemProps {
    totalNodes: number;
    totalDepth?: number;
}


const ToolItem: FC<ToolItemProps> = ({ name, onClickEvent }) => {
  return (
      <div className=" border-b border-[#505050] pl-8 px-5 py-5 flex justify-between items-left w-full">
        <span className="text-white">{name}</span>
        <div style={{ cursor: 'pointer' }} className="bg-[#9E9E9E40] rounded-full w-[24px] h-[24px] flex items-center justify-center">
          <Image src="/add.svg" alt="Add" width={16} height={16} onClick={onClickEvent} />
        </div>
      </div>
  );
};

const GoalItem: FC<GoalItemProps> = ({totalNodes, totalDepth}) => {
  return (
      <div className="flex-col py-5 flex justify-between items-left w-full">
        <h3 className="font-bold text-white text-xl flex-grow ml-2">Goals</h3>
        <div className="flex items-center pl-10 pt-4">
          <input
              type="number"
              className="bg-[#9E9E9E40] text-white p-2 w-36 rounded"
              placeholder="Maximum Steps"
          />
          <p className="ml-2 text-white text-l flex-grow">/ {totalNodes} steps</p>
        </div>

        <div className="flex items-center pl-10 pt-4">
          <input
              type="number"
              className="bg-[#9E9E9E40] text-white p-2 w-36 rounded"
              placeholder="Maximum Depth"
          />
          <p className="ml-2 text-white text-l flex-grow">/ 3 depth</p>
        </div>

        {/*<p className='pl-8 pt-5 text-white text-l flex-grow'> Dead Points </p>*/}
      </div>
  );
};

export interface ToolBarProps {
    onInterfaceClick: () => void;
    onTouchPointsClick?: () => void;
    onActionsClick?: () => void;
    totalNodes: number;
}

export const ToolBar: FC<ToolBarProps> = ({ onInterfaceClick,
                                              onTouchPointsClick= () => {},
                                              onActionsClick = () => {},
                                                totalNodes= 0
}) => {
  return (
      <div className="flex flex-col items-center w-[340px] h-screen border border-[#505050] bg-[#333]">
        <div className="flex items-center justify-between w-full mb-4 mt-3 px-5">
          <div className="relative w-[18px] h-[21px]">
            <Image src="/subtract.svg" alt="Node" layout="fill" className="absolute" />
            <Image src="/group-1.svg" alt="Node Overlay" layout="fill" className="absolute left-[-1px] top-[-1px]" />
          </div>
          <h1 className="text-white text-xl font-bold flex-grow ml-2">Add Nodes</h1>
          <Image src="/question.svg" alt="Help" width={20} height={20} />
        </div>

        <div className="flex flex-col w-full mb-4">
          <h3 className="font-bold text-white text-xl flex-grow ml-2">Nodes</h3>
          <ToolItem name="Interface" onClickEvent={onInterfaceClick} />
            {/*todo implement if you have time*/}
          {/*<ToolItem name="Touch Points" onClickEvent={onTouchPointsClick} />*/}
          {/*<ToolItem name="Actions" onClickEvent={onActionsClick} />*/}
          <GoalItem totalNodes={totalNodes} />
        </div>


          <DownloadButton/>


      </div>
  );
};


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
  //   todo possible set up initial layout for easy demo
  { id: '1', position: { x: 100, y: 0 }, data: { label: 'Start Node' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'End Node'}, parentId: '1' },
];

const nodeTypes = { stepNode: StepNode };



const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export const FlowComponent: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeDesc, setNodeDesc] = useState('');

    const onConnect = useCallback(
        (params: any) => {
            // Determine the handleId value (you can check either sourceHandle or targetHandle)
            const handleId = params.sourceHandle || params.targetHandle;
            const isHandleIdTrue = handleId === 'true'; // or some logic to determine the handleId's boolean value
            const edgeColor = isHandleIdTrue ? 'green' : 'red';

            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: 'smoothstep',
                        style: { strokeWidth: 5, stroke: edgeColor }
                    },
                    eds
                )
            );
        },
        [setEdges]
    );
  const addNode = useCallback(() => {
    const newUuid = uuid()
    const newNode: FlowElement = {
      type: 'stepNode',
      id: newUuid,
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: `${nodeName}: ${nodeDesc}` }
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
    setNodeDesc('');
  }, [nodeName, nodeDesc, setNodes]);

  return (
    <div className='flex  bg-[#272728] w-full' >
    <ToolBar onInterfaceClick={addNode}
             onActionsClick={() => {}}
             onTouchPointsClick={() => {}}
             totalNodes={nodes.length}
    />
    <div className="pb-20 pt-2 pl-5 w-full">
      <div className="flex gap-2 mb-2">
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
    </div>
  );
}

const WrappedFlowComponent: FC = () => (
    <ReactFlowProvider>
        <FlowComponent />
    </ReactFlowProvider>
);

export default WrappedFlowComponent;
