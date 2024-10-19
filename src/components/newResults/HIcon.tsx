// src/components/newResults/HIcon.tsx
import React from 'react';
import Image from 'next/image';

const HexagonHIcon: React.FC = () => {
  return (
    <div className="relative w-6 h-6">
      <Image src="/Hexagon.svg" alt="Hexagon" layout="fill" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image src="/H.svg" alt="H" width={10} height={10} />
      </div>
    </div>
  );
};

export default HexagonHIcon;
