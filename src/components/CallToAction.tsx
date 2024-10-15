import React from 'react';
import Image from 'next/image';

const CallToAction: React.FC = () => {
  return (
    <section className="bg-[#0d1117] py-20 relative h-[1348px] overflow-hidden">
      <div className="container mx-auto px-20 text-center relative z-10">
        <div className="pt-[43px] pb-[143px]">
          <h2 className="text-[64px] font-bold mb-[143px] leading-[68px]">
            <span className="text-white">TIADA Usability Testing</span><br/>
            <span className="text-[#6159f9]">Reimagine</span>
          </h2>
          <div className="flex justify-center gap-2">
            <button className="bg-gradient-to-b from-white to-white text-[#0d1117] px-[68px] py-[18px] rounded-md text-[19px] font-bold flex items-center">
              Learn more
              <Image src="/arrow-right-dark.svg" alt="Arrow Right" width={20} height={20} className="ml-[37px]" />
            </button>
            <button className="bg-transparent text-white border border-white px-[52px] py-[19px] rounded-md text-[19px] font-bold flex items-center">
              Try demo now
              <Image src="/arrow-right-light.svg" alt="Arrow Right" width={20} height={20} className="ml-[60px]" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
        <Image src="/hero-background.png" alt="Hero Background" layout="fill" objectFit="cover" style={{ backgroundPosition: '-577.958px -170px', backgroundSize: '170.911% 114.431%' }} />
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Image src="/globe.png" alt="Globe" width={900} height={900} style={{ mixBlendMode: 'color-dodge' }} />
      </div>
      <div className="absolute bottom-[300px] left-1/2 transform -translate-x-1/2">
        <Image src="/Group-3740.svg" alt="Tiada Logo" width={193.93} height={218.845} />
      </div>
      <div className="absolute bottom-[200px] left-1/2 transform -translate-x-1/2">
        <Image src="/TIADA.png" alt="Tiada Text" width={282} height={63} />
      </div>
    </section>
  );
};

export default CallToAction;

