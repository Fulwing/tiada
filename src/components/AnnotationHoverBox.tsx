import React from 'react';
import Image from 'next/image';
import { Annotation, UploadedImage } from './FrontPage';

interface AnnotationHoverBoxProps {
  annotation: Annotation;
  position: { x: number; y: number };
  images: UploadedImage[];
}

const AnnotationHoverBox: React.FC<AnnotationHoverBoxProps> = ({ annotation, position, images }) => {
  const getNavigateToPageName = () => {
    const navigateToPage = images.find(img => img.id === annotation.navigateToId);
    return navigateToPage ? navigateToPage.name : 'Unknown';
  };

  const borderColor = annotation.isTrue ? '#3FB950' : '#FF4848';

  return (
    <div
      className="absolute z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div 
        className="flex flex-col w-[194px] p-[6px_17px] gap-[13px] rounded-[6px] bg-[rgba(45,45,45,0.80)]"
        style={{ border: `1.8px solid ${borderColor}` }}
      >
        <div className="flex flex-col items-start gap-[4px]">
          <div className="flex items-center gap-[8px]">
            <Image
              src={annotation.isTrue ? "/Ellipse 2336.svg" : "/red-circle.svg"}
              alt="Status"
              width={12}
              height={12}
            />
            <span className="text-[#C9D1D9] text-[13px] font-semibold leading-[21px]">
              {annotation.name}
            </span>
          </div>
          <div className="flex items-center gap-[7.656px]">
            <span className="text-[#C9D1D9] text-[11px] font-normal leading-[18px]">
              Navigate to: {getNavigateToPageName()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationHoverBox;