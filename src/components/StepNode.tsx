import React, {FC, useState} from "react";
import {Handle, Position, useNodeId} from "@xyflow/react";
import {useDropzone} from 'react-dropzone';






const StartEndCheckBox: FC = () => {

  // State to track which checkbox is checked ('start', 'end', or null)
  const [checked, setChecked] = useState<'start' | 'end' | null>(null);

  // Handler function to change the checked state
  const handleCheckboxChange = (value: 'start' | 'end') => {
    setChecked((prev) => (prev === value ? null : value));
  };

  return (
    <div className="gap-3 h-9 rounded-full p-4 flex justify-center items-center w-32 z-0 ">
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



}




const NodeMenu: FC = () => {

    const [selectedOption, setSelectedOption] = useState('');

    return (
      <div className = "flex gap-3 justify-center pl-2">
        <div className="w-28 h-5 rounded-full shadow-lg p-4 flex justify-center  items-center bg-[#272728]">
        <div className="flex  gap-1 p-3">
          <div className={`rounded-full ${selectedOption === 'true' ? 'bg-[#09A854]' : 'bg-transparent'}`}>
            <button className={`h-2 text-xs text-white w-12 font-semibold ${selectedOption === 'true' ? 'text-black' : 'text-white'}`} onClick={() => setSelectedOption('true')}>True</button>
          </div>
          <div className={`rounded-full ${selectedOption === 'false' ? 'bg-[#D93535]' : 'bg-transparent'}`}>
            <button className= {`h-2 text-xs text-white w-12 font-semibold ${selectedOption === 'false' ? 'text-black' : 'text-white'}`} onClick={() => setSelectedOption('false')}>False</button>
          </div>
        </div>
      </div>
       <StartEndCheckBox/>
       </div>
      );

}



const StepNode: FC = () => {
    const nodeId = useNodeId();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const {getRootProps, getInputProps} = useDropzone({
      onDrop: acceptedFiles => {
          const file = acceptedFiles[0];
          setUploadedImage(URL.createObjectURL(file));
      }
  });
  
    return (
<div className=" rounded-lg shadow-lg p-4 flex flex-col gap-2 bg-[#333]">
    <div className={"justify-between flex"}>
    <h1 className="text-white text-m font-semibold">
        Stage #
    </h1>
        <button>
        </button>
    </div>
    <div {...getRootProps()} className={`flex justify-center items-center w-full rounded-lg ${uploadedImage ? 'h-auto bg-gray-200' : 'h-48 bg-gray-300'} `}>
    <input {...getInputProps()} />
    {uploadedImage ? <img src={uploadedImage} alt="Uploaded" className="max-h-[36rem] max-w-full"/> :
        <p className="text-gray-500 text-sm">Upload image here</p>}
    </div>
    <Handle id = "true" type="source" position={Position.Top} style={{ background: '#00FF00'}} />
    <Handle id= "unlinked" type="target" position={Position.Left} style={{ background: '#555'  }} />
    <Handle id = "false" type="source" position={Position.Bottom} style={{ background: '#FF0000' }} />
    <NodeMenu/>
</div>
    );

}

export default StepNode;