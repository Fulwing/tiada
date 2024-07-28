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
    dragHandle: string;
}




const DownloadButton: FC = () => {
    const { getNodes } = useReactFlow();
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const { getEdges } = useReactFlow();

    async function printNodeImagesBase64(nodes: any): Promise<Array<[any, string]>> {
        const results: Array<[any, string]> = [];
    
        const promises = nodes.map(async (node: any) => {
            const nodeElement = document.querySelector(`.react-flow__node`);
            if (nodeElement instanceof HTMLElement) {
                const htmlElement = nodeElement as HTMLElement;
                const croppedWidth = htmlElement.offsetWidth + 40;
                const croppedHeight = htmlElement.offsetHeight + 40;
    
                // Create a hidden container
                const hiddenContainer = document.createElement('div');
                hiddenContainer.style.position = 'fixed';
                hiddenContainer.style.left = '-9999px';
                hiddenContainer.style.top = '-9999px';
                document.body.appendChild(hiddenContainer);
    
                // Clone the element to apply cropping
                const clonedElement = htmlElement.cloneNode(true) as HTMLElement;
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = '-20px';
                clonedElement.style.top = '-20px';
                clonedElement.style.width = `${croppedWidth}px`;
                clonedElement.style.height = `${croppedHeight}px`;
                clonedElement.style.transform = 'translate(-20px, -20px)';
    
                hiddenContainer.appendChild(clonedElement);
    
                const png = await toPng(clonedElement, {
                    backgroundColor: 'white',
                    width: htmlElement.offsetWidth - 45,
                    height: htmlElement.offsetHeight - 140,
                    style: {
                        transform: `translate(-25px, -35px)`,
                    },
                });
                document.body.removeChild(hiddenContainer);
    
                // Add the node and its PNG to the results array
                results.push([node.id, png]);
            }
        });
    
        // Wait for all promises to resolve
        await Promise.all(promises);

        return results;
    }

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

    function RemoveNonExistingNodesFromMap(nodeData: Map<string, any>, getNodes: () => Array<{ id: string }>) {
        // Get the list of existing node IDs
        const existingNodeIds = new Set(getNodes().map(node => node.id));
    
        // Convert nodeData keys to an array and loop through them
        for (const nodeId of Array.from(nodeData.keys())) {
            if (!existingNodeIds.has(nodeId)) {
                nodeData.delete(nodeId);
            }
        }
    }

    function PrintNodeData (nodeData: Map<string, any>, getNodes: () => Array<{ id: string }>, markedImages: Array<[any, string]>) {
        const nodes = getNodes();
        const orderedNodeIds = ListOfSortedNodeIds();
        const combinedArray = [];
        RemoveNonExistingNodesFromMap(nodeData, getNodes);



        combinedArray.push(orderedNodeIds, Array.from(nodeData.entries()), markedImages);
        console.log(combinedArray);
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

    const onClick = async () => {
        const nodes = getNodes();
         const markedImages = await printNodeImagesBase64(nodes);    


            
            PrintNodeData(nodeData, getNodes, markedImages);
            
    };

    return (
        // TODO delay the button until the images are loaded
        // <Link href="/generate">
            <button
                className="flex justify-center p-32 bg-[#6A6DCD] text-white py-2 rounded w-1/2 mt-64 mb-2 hover:bg-[#5a5fb0] hover:shadow-lg mx-auto"
                onClick={() => {
                    onClick();
                }}
                style={{ cursor: 'pointer' }}>
                Next
            </button>
        // </Link>
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
                    className="bg-[#9E9E9E40] text-white p-2 w-40 rounded"
                    placeholder="Maximum Steps"
                />
                <p className="ml-2 text-white text-l flex-grow">/ {totalNodes} steps</p>
            </div>

            <div className="flex items-center pl-10 pt-4">
                <input
                    type="number"
                    className="bg-[#9E9E9E40] text-white p-2 w-40 rounded"
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

    totalNodes = 0,
}) => {
    return (
<div className=" flex-col items-center w-[370px] h-auto border border-[#505050] bg-[#333] justify-start pt-10 ">
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

            <DownloadButton />
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
        dragHandle: '.custom-drag-handle',
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
        },
        dragHandle: '.custom-drag-handle',
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
        },
        dragHandle: '.custom-drag-handle',
    },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export const FlowComponent: FC = () => {
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const [nodes, setNodes, onNodesChange] = useNodesState<StepNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // const isFetchInitialized = useRef(false);

    // useEffect(() => {
    //     if (!isFetchInitialized.current) {
    //         const fetchFakeNode = async () => {
    //             try {
    //                 const res = await fetch(`/api/node/getFakeNode/`);
    //                 if (!res.ok) {
    //                     throw new Error('not found');
    //                 }

    //                 const data = await res.json();

    //                 setNodeData(node1id, { unmarkedImage: data[0].picture });
    //                 setNodeData(node2id, { unmarkedImage: data[1].picture });
    //                 setNodeData(node3id, { unmarkedImage: data[2].picture });
    //             } catch (error) {
    //                 if (error instanceof Error) {
    //                     console.log(error.message);
    //                 } else {
    //                     console.log('An unknown error occurred');
    //                 }
    //             } finally {
    //                 console.log('done');
    //             }
    //         };
    //         fetchFakeNode().then(() => { });
    //         isFetchInitialized.current = true;
    //     }
    // }, [setNodeData]);

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
            dragHandle: '.custom-drag-handle',
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
        <div className='flex bg-[#272728] w-full min-h-screen '>
            <ToolBar
                onInterfaceClick={addNode}
                onActionsClick={() => { }}
                onTouchPointsClick={() => { }}
                totalNodes={nodes.length}
            />
            <div className="pb-20 pt-20 pl-5 w-full h-screen">
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
