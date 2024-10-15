import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Annotation {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageAnnotationProps {
  src: string;
  onAnnotationChange: (annotations: Annotation[]) => void;
}

const ImageAnnotation: React.FC<ImageAnnotationProps> = ({ src, onAnnotationChange }) => {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
  
    const drawAnnotations = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
  
      annotations.forEach(({ x, y, width, height }) => {
        ctx.strokeRect(x, y, width, height);
      });
    }, [annotations]);
  
    const adjustCanvasSize = useCallback(() => {
      if (imageRef.current && canvasRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const imgAspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;
  
        let width, height;
        if (imgAspectRatio > containerAspectRatio) {
          width = containerWidth;
          height = containerWidth / imgAspectRatio;
        } else {
          height = containerHeight;
          width = containerHeight * imgAspectRatio;
        }
  
        imageRef.current.style.width = `${width}px`;
        imageRef.current.style.height = `${height}px`;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        drawAnnotations();
      }
    }, [drawAnnotations]);

  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPos.x;
    const height = y - startPos.y;

    const newAnnotations = [...annotations.slice(0, -1), { x: startPos.x, y: startPos.y, width, height }];
    setAnnotations(newAnnotations);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    onAnnotationChange(annotations);
  };

  <Image
  ref={imageRef}
  src={src}
  alt="Annotatable"
  layout="responsive"
  width={500}
  height={300}
  onLoad={adjustCanvasSize}
/>

useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      adjustCanvasSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [adjustCanvasSize]);



  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        ref={imageRef}
        src={src}
        alt="Annotatable"
        layout="fill"
        objectFit="contain"
        onLoad={adjustCanvasSize}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default ImageAnnotation;