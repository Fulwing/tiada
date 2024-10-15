import React from 'react';
import Image from 'next/image';

const Security: React.FC = () => {
  return (
    <section className="bg-[#0d1117] py-20">
      <div className="container mx-auto px-20">
        <div className="flex mb-16">
          <div className="w-[106px] flex flex-col items-center">
            <div className="w-6 h-7 bg-[#939aff] mb-6 relative">
              <Image src="/security-icon.svg" alt="Security Icon" layout="fill" />
            </div>
            <div className="w-[3px] h-[328px] bg-gradient-to-b from-[#abb4ff] via-[#797ef9] to-[#0d1117]"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl mb-6 font-normal">Security</h2>
            <p className="text-5xl leading-[52px]">
              <span className="text-[#939aff]">Protect the security of your idea before launch.</span>
              <span className="text-white"> AI persona testers reduce the risk of product information leaking during testing.</span>
            </p>
          </div>
        </div>
        <div className="bg-[#161b22] rounded-lg border border-[#30363d] h-[493px] mb-16 relative">
          <Image src="/security-image.png" alt="Security" layout="fill" objectFit="contain" />
        </div>
        <div className="flex">
          <div className="w-[103px] relative">
            <div className="w-[3px] h-[721px] bg-gradient-to-b from-[#0d1117] via-[#797ef9] to-[#0d1117] absolute left-[50px]"></div>
          </div>
          <div className="flex-1">
            <div className="mb-16">
              <p className="text-white text-2xl leading-loose mb-4 w-[497px]">
                Sometimes it&apos;s hard to promise idea security even the testers are internal. However, Tiada AI personas won&apos;t leak your creative secrets.
              </p>
              <a href="#" className="text-[#939aff] text-[19px] font-bold flex items-center">
                Explore details of data privacy
                <Image src="/arrow-right-purple.svg" alt="Arrow Right" width={20} height={20} className="ml-2" />
              </a>
            </div>
            <div>
              <div className="inline-block bg-[#0d1117] rounded-3xl px-2 py-1 mb-4">
                <span className="text-[#939aff] text-[11px] font-bold">Did you know?</span>
              </div>
              <h3 className="text-[#939aff] text-[64px] leading-[68px] mb-4 w-[717px]">Your data security is Tiada&apos;s highest priority.</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;

