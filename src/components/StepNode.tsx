import React, {FC, memo, useContext, useEffect, useState} from "react";
import {Handle, Position, Node, NodeProps, useNodesState, useNodeId} from "@xyflow/react";
import {useDropzone} from 'react-dropzone';
import { UnmarkedImageContext } from './InteractiveFlow';






const StartEndCheckBox: FC = () => {
    const [checked, setChecked] = useState<'start' | 'end' | null>(null);
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const nodeId = useNodeId() as string;

    const handleCheckboxChange = (value: 'start' | 'end') => {
        setChecked((prev) => (prev === value ? null : value));
        if (value === 'start') {
            setNodeData(nodeId, { start: !nodeData.get(nodeId)?.start });
        } else if (value === 'end') {
            setNodeData(nodeId, { end: !nodeData.get(nodeId)?.end });
        }
    };

    useEffect(() => {
        if (nodeId && nodeData.has(nodeId)) {
            const node = nodeData.get(nodeId);
            const newChecked = node?.start ? 'start' : node?.end ? 'end' : null;
            if (newChecked !== checked) {
                setChecked(newChecked);
            }
        }
    }, [nodeId, nodeData, checked]);

    return (
        <div className="gap-3 h-9 rounded-full p-4 flex justify-center items-center w-32 z-0">
            <div className="flex">
                <input
                    className="bg-[#272728]"
                    type="checkbox"
                    checked={checked === 'start'}
                    onChange={() => handleCheckboxChange('start')}
                />
                <span className="text-xs text-white ml-2">Start</span>
            </div>
            <div className="flex">
                <input
                    type="checkbox"
                    checked={checked === 'end'}
                    onChange={() => handleCheckboxChange('end')}
                />
                <span className="text-xs text-white ml-2">End</span>
            </div>
        </div>
    );
};




const NodeMenu: FC = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const nodeId = useNodeId() as string;

    const handleOptionChange = (option: 'true' | 'false') => {
        setNodeData(nodeId, { conditions: option === 'true' });
    };

    useEffect(() => {
        if (nodeId && nodeData.has(nodeId)) {
            setSelectedOption(nodeData.get(nodeId)?.conditions ? 'true' : 'false');
        }
    }, [nodeId, nodeData]);

    return (
      <div className = "flex gap-3 justify-center pl-2">
        <div className="w-28 h-5 rounded-full shadow-lg p-4 flex justify-center  items-center bg-[#272728]">
        <div className="flex  gap-1 p-3">
          <div className={`rounded-full ${selectedOption === 'true' ? 'bg-[#09A854]' : 'bg-transparent'}`}>
            <button className={`h-2 text-xs text-white w-12 font-semibold ${selectedOption === 'true' ? 'text-black' : 'text-white'}`} onClick={() => {
                setSelectedOption('true');
                handleOptionChange('true');
            }}>True</button>
          </div>
          <div className={`rounded-full ${selectedOption === 'false' ? 'bg-[#D93535]' : 'bg-transparent'}`}>
            <button className= {`h-2 text-xs text-white w-12 font-semibold ${selectedOption === 'false' ? 'text-black' : 'text-white'}`} onClick={() => {
                setSelectedOption('false');
                handleOptionChange('false');
            }}>False</button>
          </div>
        </div>
      </div>
       <StartEndCheckBox/>
       </div>
      );

}

interface StepNodeData {
    markedImage?: string;
    unmarkedImage?: string;
    updateNodeData: (data: { markedImage?: string; unmarkedImage?: string }) => void;
}

const StepNodeComponent: FC<{ data: StepNodeData; isConnectable: boolean }> = ({ data, isConnectable }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
    const nodeId = useNodeId() as string;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            setUploadedImage(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (nodeId) {
                    setNodeData(nodeId, { markedImage: base64String });
                }
                data.updateNodeData({ markedImage: '', unmarkedImage: base64String });
            };
            reader.readAsDataURL(file);
        }
    });

    useEffect(() => {
        if (nodeId && nodeData.has(nodeId)) {
        }
    }, [nodeId, nodeData]);

    return (
        <div className="rounded-lg shadow-lg p-4 flex flex-col gap-2 bg-[#333]">
            <div className="justify-between flex">
                <h1 className="text-white text-xs font-semibold">
                    Node {nodeId ? (nodeId.length > 10 ? `[${nodeId.substring(0, 8)}...]` : nodeId) : 'No ID'}
                </h1>
            </div>
            <div {...getRootProps()}
                 className={`flex justify-center items-center w-full rounded-lg ${uploadedImage ? 'h-auto bg-gray-200' : 'h-48 bg-gray-300'} `}>
                <input {...getInputProps()} />
                {uploadedImage ? <img src={uploadedImage} alt="Uploaded" className="inner-image max-h-[36rem] max-w-full"/> :
                    <p className="text-gray-500 text-sm">Upload image here</p>}
            </div>
            <Handle id="true" type="source" position={Position.Top} style={{ background: '#00FF00'}} />
            <Handle id="unlinked" type="target" position={Position.Left} style={{ background: '#555'  }} />
            <Handle id="false" type="source" position={Position.Bottom} style={{ background: '#FF0000' }} />
            <NodeMenu />
        </div>
    );
};

const MemoizedStepNodeComponent = memo(StepNodeComponent);
MemoizedStepNodeComponent.displayName = 'StepNodeComponent';

export default MemoizedStepNodeComponent;