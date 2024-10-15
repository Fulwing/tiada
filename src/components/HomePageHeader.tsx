import React from 'react';
import Image from 'next/image';

const HomePageHeader: React.FC = () => {
  return (
    <header className="bg-[#1c1d1f] py-4">
      <div className="container mx-auto px-20 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Image src="/tiada-logo.svg" alt="Tiada Logo" width={21} height={24} />
          <nav>
            <ul className="flex gap-8">
              <li><a href="#" className="text-white text-[15px] font-normal">Home</a></li>
              <li><a href="#" className="text-white text-[15px] font-normal">About Tiada</a></li>
              <li><a href="#" className="text-white text-base font-normal">Team</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search GitHub"
              className="bg-[#2e374a]/80 border border-[#57606a] rounded-md py-[9px] pl-[13px] pr-[9px] text-sm text-[#8c959f] w-[232px]"
            />
            <Image
              src="/search-icon.svg"
              alt="Search"
              width={17}
              height={20}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <a href="#" className="text-white text-base font-normal">Sign in</a>
          <a href="#" className="text-white text-base font-normal border border-[#d0d7de] rounded-md px-[9px] py-[5px]">Sign up</a>
        </div>
      </div>
    </header>
  );
};

export default HomePageHeader;

