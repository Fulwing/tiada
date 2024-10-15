import React from 'react';
import Image from 'next/image';

const NavigationBar: React.FC = () => {
    return (
        <nav className="flex justify-center items-center w-full h-14 bg-[#1C1D1F]">
            <div className="flex items-center justify-between w-full max-w-7xl px-5">
                <div className="flex items-center">
                    <Image src="/Group-3740.svg" alt="Tiada Logo" width={21} height={24} />
                    <div className="flex ml-8 space-x-8">
                        <a href="#" className="text-white text-sm">Home</a>
                        <a href="#" className="text-white text-sm">About Tiada</a>
                        <a href="#" className="text-white text-sm">Team</a>
                    </div>
                </div>
                <div className="flex items-center space-x-5">
                    <button className="text-white text-sm">Log In</button>
                    <button className="text-white text-sm border border-[#D0D7DE] rounded px-3 py-1">Sign up</button>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;