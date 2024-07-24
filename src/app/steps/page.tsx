"use client";

import WrappedFlowComponent from "../../components/InteractiveFlow";


function Page() {
    return (
        // toolbar must be in interactiveFlow to be used to add/interact with nodes
        <div className="flex bg-[#272728] ">
            <WrappedFlowComponent />
        </div>
    );
}

export default Page;