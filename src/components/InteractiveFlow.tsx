import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StepNodeComponent from './StepNode';
import { v4 as uuid } from 'uuid'
import Image from 'next/image';
import { toPng } from 'html-to-image';
import Link from 'next/link';

interface StepNode {
    parentId: string;
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: {
        markedImage: string;
        unmarkedImage: string;
        updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => void;
    };
}

const printNodeImagesBase64 = async (nodes: StepNode[]) => {
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
                // console.log(png);
            }
        }
    }
};

interface DownloadButtonProps {
    onNextButton: () => void;
}

const DownloadButton: FC<DownloadButtonProps> = ({ onNextButton }) => {
    const { getNodes } = useReactFlow();
    const { nodeData } = useContext(UnmarkedImageContext);
    const { getEdges } = useReactFlow();

    function ListOfSortedNodeIds() {
        const nodeIds = Array.from(nodeData.keys());
        const startNode = nodeIds.find(nodeId => nodeData.get(nodeId)?.start);

        if (!startNode) {
            return [];
        }

        const edges = getEdges();
        const connectedNodes = new Set<string>();

        const traverse = (nodeId: string) => {
            connectedNodes.add(nodeId);
            edges.forEach(edge => {
                if (edge.id.includes('true')) {
                    if (edge.source === nodeId && !connectedNodes.has(edge.target)) {
                        traverse(edge.target);
                    }
                    if (edge.target === nodeId && !connectedNodes.has(edge.source)) {
                        traverse(edge.source);
                    }
                }
            });
        };

        traverse(startNode);

        return Array.from(connectedNodes);
    }

    const postDataToDB = async (data: any) => {
        try {
            const response = await fetch('/api/node/addNode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to post data to the database');
            }

            const result = await response.json();
            console.log('Data posted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    };

    const onClick = () => {
        const nodes = getNodes().map(node => ({
            ...node,
            data: {
                ...node.data,
            }
        })) as StepNode[];

        const combinedArray = [];

        printNodeImagesBase64(nodes).then(() => { });
        const orderedNodeIds = ListOfSortedNodeIds();
        combinedArray.push(orderedNodeIds, Array.from(nodeData.entries()));
        console.log(combinedArray);
    };

    return (
        <Link href="/generate">
            <button
                className="bg-[#6A6DCD] text-white py-3 px-6 rounded-lg shadow-lg hover:bg-[#5a5fb4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A6DCD] transform transition-transform duration-300 ease-in-out hover:scale-105 w-full mt-4 mb-2"
                onClick={() => {
                    onClick();
                    onNextButton();
                }}
                style={{ cursor: 'pointer' }}>
                Next
            </button>
        </Link>
    );
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

const GoalItem: FC<GoalItemProps> = ({ totalNodes, totalDepth }) => {
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
    onNextClick?: () => void;
    totalNodes: number;
}

export const ToolBar: FC<ToolBarProps> = ({ onInterfaceClick,
    onTouchPointsClick = () => { },
    onActionsClick = () => { },
    totalNodes = 0,
    onNextClick = () => { }
}) => {
    return (
        <div className="flex flex-col items-center w-[340px] h-screen border border-[#505050] bg-[#333] mt-20 justify-start pt-10">
            <div className="flex items-center justify-between w-full mb-4 px-5">
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
                {/*<ToolItem name="Touch Points" onClickEvent={onTouchPointsClick} />*/}
                {/*<ToolItem name="Actions" onClickEvent={onActionsClick} />*/}
                <GoalItem totalNodes={totalNodes} />

                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-white text-xs mt-10 flex-grow justify-center pl-8"> Don't have any interface to test now?</p>
                <button className="bg-white text-gray-500 w-auto h-12 rounded mb-5 ml-5 mr-5 mt-2">Select an example to test</button>
            </div>

            <DownloadButton onNextButton={onNextClick} />
        </div>
    );
};

const node1id = uuid();
const node2id = uuid();
const node3id = uuid();

const initialNodes: StepNode[] = [
    {
        parentId: '',
        type: 'stepNode',
        id: node1id,
        position: { x: 100, y: 100 },
        data: { markedImage: '', unmarkedImage: '', updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => { } },
    },
    {
        parentId: '',
        type: 'stepNode',
        id: node2id,
        position: { x: 500, y: 100 },
        data: {
            markedImage: '',
            unmarkedImage: '',
            updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => { }
        }
    },
    {
        parentId: '',
        type: 'stepNode',
        id: node3id,
        position: { x: 900, y: 100 },
        data: {
            markedImage: '',
            unmarkedImage: '',
            updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => { }
        }
    },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export const FlowComponent: FC = () => {
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const [nodes, setNodes, onNodesChange] = useNodesState<StepNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const isFetchInitialized = useRef(false);

    useEffect(() => {
        if (!isFetchInitialized.current) {
            const fetchFakeNode = async () => {
                try {
                    const res = await fetch(`/api/node/getFakeNode/`);
                    if (!res.ok) {
                        throw new Error('not found');
                    }

                    const data = await res.json();

                    setNodeData(node1id, { unmarkedImage: data[0].picture });
                    setNodeData(node2id, { unmarkedImage: data[1].picture });
                    setNodeData(node3id, { unmarkedImage: data[2].picture });

                    console.log(data);
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    } else {
                        console.log('An unknown error occurred');
                    }
                } finally {
                    console.log('done');
                }
            };
            fetchFakeNode().then(() => { });
            isFetchInitialized.current = true;
        }
    }, [setNodeData]);

    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current) {
            const initialNodeData = new Map<string, { unmarkedImage: string | null; markedImage: string | null; start: boolean; end: boolean; conditions: boolean }>();
            initialNodes.forEach(node => {
                initialNodeData.set(node.id, { unmarkedImage: null, markedImage: null, start: false, end: false, conditions: false });
            });
            initialNodeData.forEach((data, nodeId) => {
                setNodeData(nodeId, data);
            });
            isInitialized.current = true;
        }
    }, [setNodeData]);

    const getNodesConnectedByTrueEdge = () => {
        const trueEdges = edges.filter(edge => edge.id.includes('true'));
        const connectedNodeIds = new Set(trueEdges.flatMap(edge => [edge.source, edge.target]));
        const connectedNodes = nodes.filter(node => connectedNodeIds.has(node.id));
        console.log(connectedNodes);
        return connectedNodes;
    };

    const nodeTypes = useMemo(() => ({ stepNode: StepNodeComponent }), []);

    const onConnect = useCallback(
        (params: any) => {
            const handleId = params.sourceHandle || params.targetHandle;
            const isHandleIdTrue = handleId === 'true';
            const edgeColor = isHandleIdTrue ? 'green' : 'red';

            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: 'smoothstep',
                        style: { strokeWidth: 5, stroke: edgeColor },
                        id: isHandleIdTrue ? `true-${uuid()}` : `false-${uuid()}`
                    },
                    eds
                )
            );
        },
        [setEdges]
    );

    const addNode = useCallback(() => {
        const newUuid = uuid();
        const newNode: StepNode = {
            parentId: '',
            type: 'stepNode',
            id: newUuid,
            position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
            data: {
                markedImage: '', unmarkedImage: '', updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => {
                    setNodes((nds) =>
                        nds.map((node) => (node.id === newUuid ? { ...node, data: { ...node.data, ...data } } : node))
                    );
                },
            },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    return (
        <div className='flex  bg-[#272728] w-full'>
            <ToolBar
                onInterfaceClick={addNode}
                onActionsClick={() => { }}
                onTouchPointsClick={() => { }}
                totalNodes={nodes.length}
                onNextClick={getNodesConnectedByTrueEdge}
            />
            <div className="pb-20 pt-2 pl-5 w-full">
                <div className="flex gap-2 mb-2"></div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    style={{ height: 'calc(100vh - 80px)' }} // Adjust the height here
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
}

export const UnmarkedImageContext = createContext<{
    nodeData: Map<string, { unmarkedImage: string | null; markedImage: string | null; start: boolean; end: boolean; conditions: boolean }>;
    setNodeData: (nodeId: string, data: { unmarkedImage?: string | null; markedImage?: string | null; start?: boolean; end?: boolean; conditions?: boolean }) => void;
}>({ nodeData: new Map(), setNodeData: () => { } });

const WrappedFlowComponent: FC = () => {
    const [nodeData, setNodeDataState] = useState<Map<string, { unmarkedImage: string | null; markedImage: string | null; start: boolean; end: boolean; conditions: boolean }>>(new Map());

    const setNodeData = (nodeId: string, data: { unmarkedImage?: string | null; markedImage?: string | null; start?: boolean; end?: boolean; conditions?: boolean }) => {
        setNodeDataState(prev => {
            const newData = new Map(prev);
            const existingData = newData.get(nodeId) || { unmarkedImage: null, markedImage: null, start: false, end: false, conditions: false };
            newData.set(nodeId, { ...existingData, ...data });
            return newData;
        });
    };

    return (
        <UnmarkedImageContext.Provider value={{ nodeData, setNodeData }}>
            <ReactFlowProvider>
                <FlowComponent />
            </ReactFlowProvider>
        </UnmarkedImageContext.Provider>
    );
};

export default WrappedFlowComponent;
