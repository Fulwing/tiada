import React from 'react';
import Image from 'next/image';

const Reliability: React.FC = () => {
  return (
    <section className="bg-[#0d1117] py-20">
      <div className="container mx-auto px-20">
        <div className="flex mb-16">
          <div className="w-[106px] flex flex-col items-center">
            <div className="w-6 h-7 bg-[#148df1] mb-6 relative">
              <Image src="/reliability-icon.svg" alt="Reliability Icon" layout="fill" />
            </div>
            <div className="w-[3px] h-[380px] bg-gradient-to-b from-[#148df1] via-[#77acfb] to-[#0c1421]"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl mb-6 font-normal">Reliability</h2>
            <p className="text-5xl leading-[52px]">
              <span className="text-[#148df1]">Data-based reliability.</span>
              <span className="text-white"> Our platform provide you with reliable testing insights that are driven by data and augmented with AI&apos;s remarkable analysis power.</span>
            </p>
          </div>
        </div>
        <div className="mb-16">
          <Image src="/reliability-image-1.png" alt="Reliability" width={987} height={627} className="rounded-lg" />
        </div>
        <div className="mb-16">
          <Image src="/reliability-image-2.png" alt="Reliability Details" width={987} height={563} className="rounded-lg bg-[#161b22]" />
        </div>
        <div className="flex mb-16">
          <div className="w-[103px] relative">
            <div className="w-[3px] h-[837px] bg-gradient-to-b from-[#0d1117] via-[#2a6ecd] to-[#0d1117] absolute left-[50px]"></div>
          </div>
          <div className="flex-1">
            <p className="text-white text-2xl leading-loose mb-8 w-[610px]">
              Before Tiada, the usability testing researchers collect testing result and manually detect usability problems. <br/>Now, our <span className="text-[#78c6ff]">Test Agent AI</span> use their strong observation power on data to extract underlying problem, risk and reasons as well.
            </p>
            <a href="#" className="text-[#148df1] text-xl font-bold flex items-center mb-16">
              Explore Test Agent AI
              <Image src="/arrow-right-blue.svg" alt="Arrow Right" width={20} height={20} className="ml-2" />
            </a>
            <div className="inline-block bg-[#0d1117] rounded-3xl px-2 py-1 mb-4">
              <span className="text-[#148df1] text-[11px] font-bold">With AI analysis</span>
            </div>
            <h3 className="text-[#148df1] text-[64px] leading-[68px] mb-4">Let&apos;s data tell the unknown story</h3>
            <p className="text-white text-2xl leading-loose w-[532px]">
              AI observation on data is more sensitive than traditional manual conclusion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reliability;

