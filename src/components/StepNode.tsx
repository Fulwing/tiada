import React, { FC, memo, useContext, useEffect, useState, useRef, SyntheticEvent} from "react";
import {
  Handle,
  Position,

  useNodeId,
} from "@xyflow/react";
import { useDropzone } from "react-dropzone";
import { UnmarkedImageContext } from "./InteractiveFlow";
import Image from "next/image";
import Draggable from 'react-draggable';


const StartEndCheckBox: FC = () => {
  const [checked, setChecked] = useState<"start" | "end" | null>(null);
  const { nodeData, setNodeData } = useContext(UnmarkedImageContext);


  const nodeId = useNodeId() as string;

  const handleCheckboxChange = (value: "start" | "end") => {
    setChecked((prev) => (prev === value ? null : value));
    if (value === "start") {
      setNodeData(nodeId, { start: !nodeData.get(nodeId)?.start });
    } else if (value === "end") {
      setNodeData(nodeId, { end: !nodeData.get(nodeId)?.end });
    }
  };



  return (
    <div className="gap-3 h-9 rounded-full p-4 flex justify-center items-center w-32 z-0">
      <div className="flex">
        <input
          className="bg-[#272728]"
          type="checkbox"
          checked={checked === "start"}
          onChange={() => handleCheckboxChange("start")}
        />
        <span className="text-xs text-white ml-2">Start</span>
      </div>
      <div className="flex">
        <input
          type="checkbox"
          checked={checked === "end"}
          onChange={() => handleCheckboxChange("end")}
        />
        <span className="text-xs text-white ml-2">End</span>
      </div>
    </div>
  );
};

const NodeMenu: FC = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
  const nodeId = useNodeId() as string;

  const handleOptionChange = (option: "true" | "false") => {
    setNodeData(nodeId, { conditions: option === "true" });
  };

  useEffect(() => {
    if (nodeId && nodeData.has(nodeId)) {
      setSelectedOption(nodeData.get(nodeId)?.conditions ? "true" : "false");
    }
  }, [nodeId, nodeData]);

  return (
    <div className="flex gap-3 justify-center pl-2">
      <div className="w-28 h-5 rounded-full shadow-lg p-4 flex justify-center  items-center bg-[#272728]">
        <div className="flex  gap-1 p-3">
          <div
            className={`rounded-full ${
              selectedOption === "true" ? "bg-[#09A854]" : "bg-transparent"
            }`}
          >
            <button
              className={`h-2 text-xs text-white w-12 font-semibold ${
                selectedOption === "true" ? "text-black" : "text-white"
              }`}
              onClick={() => {
                setSelectedOption("true");
                handleOptionChange("true");
              }}
            >
              True
            </button>
          </div>
          <div
            className={`rounded-full ${
              selectedOption === "false" ? "bg-[#D93535]" : "bg-transparent"
            }`}
          >
            <button
              className={`h-2 text-xs text-white w-12 font-semibold ${
                selectedOption === "false" ? "text-black" : "text-white"
              }`}
              onClick={() => {
                setSelectedOption("false");
                handleOptionChange("false");
              }}
            >
              False
            </button>
          </div>
        </div>
      </div>
      <StartEndCheckBox />
    </div>
  );
};

interface StepNodeData {
  markedImage?: string;
  unmarkedImage?: string;
  updateNodeData: (data: {
    markedImage?: string;
    unmarkedImage?: string;
  }) => void;
}



const StepNodeComponent: FC<{ data: StepNodeData; isConnectable: boolean }> = ({
}) => {

    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [isGreenVisible, setIsGreenVisible] = useState(true); // show green draggable by default
    const [isRedVisible, setIsRedVisible] = useState(true); // show red draggable by default





  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(!!uploadedImage);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  const { nodeData, setNodeData } = useContext(UnmarkedImageContext);
  const nodeId = useNodeId() as string;


  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
  
      const image = new window.Image();
      image.src = url;
      image.onload = () => {
        setImageWidth(image.naturalWidth);
        setImageHeight(image.naturalHeight);
        setUploadedImage(url);
      };
      
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (nodeId) {
          setNodeData(nodeId, { unmarkedImage: base64String });
        }
      };
      reader.readAsDataURL(file);
      setIsImageUploaded(true);
    }
    ,
    disabled: isImageUploaded, // Disable dropzone if image is uploaded

  });



  const toggleDraggableVisibility = (color: 'red' | 'green') => {
    if (color === 'green') {
      setIsGreenVisible(!isGreenVisible);
    } else if (color === 'red') {
      setIsRedVisible(!isRedVisible);
    }
  };



  return (
<div className="relative rounded-lg shadow-lg p-4 flex flex-col gap-2 bg-[#333] ">
<span className="custom-drag-handle bg-neutral-500 w-full h-7 absolute top-0 left-0 rounded-t-lg"></span>
      <div className="justify-between flex pt-5">
        <h1 className="text-white text-xs font-semibold">
          Node{" "}
          {nodeId
            ? nodeId.length > 10
              ? `[${nodeId.substring(0, 8)}...]`
              : nodeId
            : "No ID"}
        </h1>
      </div>

      

      <div
  {...getRootProps()}
  className={`relative flex justify-center items-center w-full rounded-lg overflow-hidden ${
    uploadedImage ? 'h-auto bg-gray-200' : 'h-48 bg-gray-300'
  }`}
>
  {!uploadedImage && <input {...getInputProps()} />}

  {uploadedImage ? (
    <div className="relative">
      <Image
        src={uploadedImage}
        alt="Uploaded"
        width={imageWidth}
        height={imageHeight}
        className="inner-image max-h-auto max-w-full"
      />
      {isGreenVisible ? (
        <Draggable nodeRef={greenRef} bounds="parent">
                    <div ref={greenRef} className="opacity-70 absolute top-0 left-0 w-12 h-12 bg-green-500 cursor-pointer rounded-full">

        </div>
        </Draggable>
      ) : null}
      {isRedVisible ? (
        <Draggable nodeRef={redRef} bounds="parent">
          <div ref={redRef} className="opacity-70 absolute top-0 left-20 w-12 h-12 bg-red-500 cursor-pointer rounded-full"></div>
        </Draggable>
        
      ) : null}
    </div>
  ) : (
    <p className="text-gray-500 text-sm">Upload image here</p>
  )}
</div>
      <Handle
        id="true"
        type="source"
        position={Position.Top}
        style={{ background: "#00FF00" }}
      />
      <Handle
        id="unlinked"
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <Handle
        id="false"
        type="source"
        position={Position.Bottom}
        style={{ background: "#FF0000" }}
      />
      <NodeMenu />
      {uploadedImage ? (
      <div className="flex justify-center gap-2 ">
        <button onClick={() => toggleDraggableVisibility("green")} className=" bg-[#09A854] rounded-full h-4  text-xs text-white w-12 font-semibold">
          {isGreenVisible ? 'Hide' : 'Show'}
        </button>
        <button onClick={() =>toggleDraggableVisibility("red")} className=" bg-red-500 rounded-full h-4  text-xs text-white w-12 font-semibold">
          {isRedVisible ? 'Hide' : 'Show'}
        </button>
      </div>
        ) : null}
 
 
 

    </div>
  );
};

const MemoizedStepNodeComponent = memo(StepNodeComponent);
MemoizedStepNodeComponent.displayName = "StepNodeComponent";

export default MemoizedStepNodeComponent;
