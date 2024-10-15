import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-32 bg-gradient-to-b from-[#3A367F] to-[#0D1117]">
      <div className="container mx-auto px-20 flex items-center relative z-10">
        <div className="w-[1280px] relative">
          <div className="w-[990px] mb-16">
            <h1 className="text-8xl font-bold leading-[100px] mb-8 bg-gradient-to-br from-[#3BF0E4] to-[#BCA1F7] bg-clip-text text-transparent" style={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.96px' }}>
              Redefine<br/>Usability Testing with AI
            </h1>
            <p className="text-[#7d7d7d] text-3xl leading-[42px] w-[767px]">
              AI-powered persona and scenario generation, along with data-driven insights, streamline testing in your Agile workflows.
            </p>
          </div>
          <div className="flex mb-16">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white rounded-l-md px-4 py-3 w-[295px] text-[#6e7781]"
            />
            <button className="bg-gradient-to-b from-[rgba(183,52,179,0.15)] to-[rgba(164,46,156,0.00)] bg-[#625AFA] text-white rounded-r-md px-6 py-4 font-bold">
              Sign up for update
            </button>
            <button className="ml-8 bg-transparent border border-[#30363d] text-white rounded-md px-7 py-4 font-bold flex items-center">
              Try demo now
              <Image src="/arrow-right.svg" alt="Arrow Right" width={16} height={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-full w-1/2">
        <div className="relative h-full w-full">
          <Image 
            src="/hero-foreground.png" 
            alt="Hero Foreground" 
            layout="fill" 
            objectFit="contain" 
            objectPosition="right center"
          />
        </div>
      </div>
      <div className="absolute left-20 bottom-32 w-[106px] h-[1152px]">
        <div className="w-6 h-7 bg-[#dd7df7] absolute top-0 left-[41px]"></div>
        <div className="w-0.5 h-[268px] bg-gradient-to-b from-[#d2a8ff] via-[#a371f7] to-[#56d364] absolute top-7 left-[52px]"></div>
      </div>
    </section>
  );
};

export default Hero;

