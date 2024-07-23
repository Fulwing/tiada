
import { FC, useCallback } from "react";
import {Handle, Position} from "@xyflow/react";
import Input from "postcss/lib/input";
import {useState} from "react";




const NodeMenu: FC = () => {

    const [selectedOption, setSelectedOption] = useState('');

    return (
        <div className="w-full h-8 rounded-full shadow-lg p-4 flex justify-center  items-center bg-[#272728] w-32">
        <div className="flex  gap-1 p-3">
          <div className={`rounded-full ${selectedOption === 'true' ? 'bg-[#09A854]' : 'bg-transparent'}`}>
            <button className="text-sm text-white w-14" onClick={() => setSelectedOption('true')}>True</button>
          </div>
          <div className={`rounded-full ${selectedOption === 'false' ? 'bg-[#D93535]' : 'bg-transparent'}`}>
            <button className="text-sm text-white w-14" onClick={() => setSelectedOption('false')}>False</button>
          </div>
        </div>
      </div>
      );

}



const ImageUploadNode: FC = () => {
    return (
        <div className="pt-10 w-64 h-96 rounded-lg shadow-lg p-4 flex flex-col gap-2 bg-[#333]">
        <Handle type="source" position={Position.Left} style={{ background: '#555'}} />
        <div className="flex justify-center items-center h-64 w-auto bg-gray-200 rounded-lg">
            <p className="text-gray-500 text-sm">Image</p>
        </div>
        <Handle type="target" position={Position.Right} style={{ background: '#555' }} />
        <NodeMenu/>
        </div>
    );

}

export default ImageUploadNode;