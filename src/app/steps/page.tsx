"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FC } from 'react';
import InteractiveFlow from "../../components/InteractiveFlow"


// create page

// pass in tool item name into toolItems

interface ToolItemProps {
    name: string;
    onClickEvent: () => void;
}

const ToolItem: FC<ToolItemProps> = ({ name, onClickEvent}) => {
    return (
        <div className=" border-b border-[#505050] pl-8 px-5 py-5 flex justify-between items-left w-full" >
                   <span className="text-white">{name}</span>
                    <div style={{ cursor: 'pointer' }} className="bg-[#9E9E9E40] rounded-full w-[24px] h-[24px] flex items-center justify-center">
                        <Image src="/add.svg" alt="Add" width={16} height={16} onClick={onClickEvent}/>
                    </div>  
                </div> 
    );
}

const GoalItem: FC<ToolItemProps> = ({ name, onClickEvent}) => {
    return (
      <div className=" flex-col  pyq+-5 flex justify-between items-left w-full">
        <h3 className=" font-bold text-white text-xl  flex-grow ml-2 ">
          Goals
        </h3>
        <div className="flex items-center pl-10 pt-4">
          <input
            type="number" 
            className="bg-[#9E9E9E40] text-white p-2 w-36 rounded"
            placeholder="Maximum Steps"
          />
          <p className="ml-2 text-white text-l flex-grow">/ 7 steps</p>
        </div>

        <div className="flex items-center pl-10 pt-4">
          <input
            type="number"
            className="bg-[#9E9E9E40] text-white p-2 w-36 rounded"
            placeholder="Maximum Depth"
          />
          <p className="ml-2 text-white text-l flex-grow">/ 3 depth</p>
        </div>

        <p className='pl-8 pt-5 text-white text-l flex-grow'> Dead Points </p>
      </div>
    );
}

// onclick toolbar props

const ToolBarProps = {
  onInterfaceClick : () => {console.log("Interface Clicked")},
  onTouchPointsClick : () => {console.log("Touch Points Clicked")},
  onActionsClick : () => {console.log("Actions Clicked")},

}


export interface ToolBarProps {
  onInterfaceClick: () => void;
  onTouchPointsClick: () => void;
  onActionsClick: () => void;
}

export const ToolBar: FC<ToolBarProps> = ({ onInterfaceClick, onTouchPointsClick, onActionsClick }) => {
  return (
    <div className="flex flex-col items-center w-[340px] h-screen border border-[#505050] bg-[#333]">
      <div className=" flex items-center justify-between w-full mb-4 mt-3 px-5">
        <div className="relative w-[18px] h-[21px]">
          <Image src="/subtract.svg" alt="Node" layout="fill" className="absolute" />
          <Image src="/group-1.svg" alt="Node Overlay" layout="fill" className="absolute left-[-1px] top-[-1px]" />
        </div>
        <h1 className="text-white text-xl font-bold flex-grow ml-2">Add Nodes</h1>
        <Image src="/question.svg" alt="Help" width={20} height={20} />
      </div>

      <div className="flex flex-col w-full mb-4 ">
        <h3 className="font-bold text-white text-xl  flex-grow ml-2 ">Nodes</h3>

        <ToolItem name="Interface" onClickEvent={onInterfaceClick} />

        <ToolItem name="Touch Points" onClickEvent={onTouchPointsClick} />

        <ToolItem name="Actions" onClickEvent={onActionsClick} />

        <GoalItem name="Goals" onClickEvent={() => {}} />
      </div>

      <button
        className="
            bg-[#6A6DCD] 
            text-white 
            py-2 px-4 
            rounded 
            w-80 
            mt-auto 
            mb-2 
            m-5"
        style={{ cursor: 'pointer' }}
      >
        Next
      </button>
    </div>
  );
};

function Page() {
    return (

        <div className="flex bg-[#272728] ">
            <InteractiveFlow />            
        </div>
    );
}

export default Page;