import React from 'react';
import Image from 'next/image';

const Productivity: React.FC = () => {
  return (
    <section className="bg-[#0d1117] py-20 relative">
      <div className="container mx-auto px-20">
        <div className="flex mb-16">
          <div className="w-[106px] flex flex-col items-center">
            <div className="w-6 h-7 bg-[#7ee787] mb-6 relative">
              <Image src="/productivity-icon.svg" alt="Productivity Icon" layout="fill" />
            </div>
            <div className="w-[3px] h-[328px] bg-gradient-to-b from-[#56d364] via-[#2ea043] to-[#0d1117]"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl mb-6 font-normal">Productivity</h2>
            <div className="text-5xl leading-[52px]">
              <span className="text-[#7ee787]">Accelerate traditional usability testing process.</span>
              <span className="text-white"> Let hundreds of </span>
              <span className="text-[#7ee787]">AI testers</span>
              <span className="text-white"> provide you with usability insights in just a second.</span>
            </div>
          </div>
        </div>
        <div className="relative mb-16">
          <Image src="/productivity-image.png" alt="Productivity" width={1280} height={730} className="rounded-lg border border-[#30363d]" />
        </div>
        <div className="flex">
          <div className="w-[103px] relative">
            <div className="w-[3px] h-[749px] bg-gradient-to-b from-[#0d1117] via-[#2ea043] to-[#0d1117] absolute left-[50px]"></div>
          </div>
          <div className="flex-1">
            <div className="mb-16">
              <p className="text-white text-2xl leading-loose mb-4">
                AI testers are generated based on your testing mission and demands. Our platform provides you with <span className="text-[#7ee787]">diverse and customizable</span> virtual personas for testing who you can reach out to anytime and at any phase of your product cycle.
              </p>
              <a href="#" className="text-[#6159f9] text-xl font-bold flex items-center">
                Check out what is virtual personas
                <Image src="/arrow-right-blue.svg" alt="Arrow Right" width={20} height={20} className="ml-2" />
              </a>
            </div>
            <div className="relative">
              <div className="inline-block bg-[#0d1117] rounded-3xl px-2 py-1 mb-4">
                <span className="text-[#7ee787] text-[11px] font-bold">Compare to traditional usability testing?</span>
              </div>
              <h3 className="text-[#7ee787] text-[64px] leading-[68px] mb-4">Less time <br/>Less money</h3>
              <p className="text-white text-xl leading-7 w-[351px]">
                Virtual personas significantly reduce your time & money on reaching and interviewing users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Productivity;

