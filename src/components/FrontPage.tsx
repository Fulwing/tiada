import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Group, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import AnnotationHoverBox from './AnnotationHoverBox';
import useImage from 'use-image';
import NavigationBar from './NavigationBar';
import UploadPrompt from './UploadPrompt';
import LeftSidebar from './LeftSidebar';
import BoundingToolPrompt from './BoundingToolPrompt';
import BoundTouchPointPrompt from './BoundTouchPointPrompt';
import CustomAnnotationBox from './CustomAnnotationBox';
import AnnotationControls from './AnnotationControls';
import FlowMap from './FlowMap';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';


export interface UploadedImage {
  id: string; // Add a unique identifier
  src: string;
  name: string;
  filename: string;
  regions: Annotation[];
  used: boolean;
  description?: string;
  touchpoints: number;
  trueTouchpoints: number;
  falseTouchpoints: number;
}
  

export interface Annotation {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  isTrue: boolean;
  navigateToId: string; // Change this from navigateTo to navigateToId
  imageSrc: string;
}

interface AnnotatedImageProps {
  src: string;
  hoveredAnnotation: Annotation | null;
  setHoveredAnnotation: React.Dispatch<React.SetStateAction<Annotation | null>>;
  hoverPosition: { x: number; y: number };
  setHoverPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleAnnotationHover: (annotation: Annotation, e: KonvaEventObject<MouseEvent>) => void;
  handleAnnotationLeave: () => void;
  // ... other necessary props
}

interface FrontPageProps {
  onFinishSetUp: (data: any) => Promise<{ error?: string } | void>;
}


const FrontPage: React.FC<FrontPageProps> = ({ onFinishSetUp }) => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [newAnnotation, setNewAnnotation] = useState<Annotation | null>(null);
    const stageRef = useRef<any>(null);
    const [showSelectPrompt, setShowSelectPrompt] = useState(false);
    const [showUsed, setShowUsed] = useState(true);
    const [showNotUsed, setShowNotUsed] = useState(true);
    const [hasSelectedFirstImage, setHasSelectedFirstImage] = useState(false);
    const [flowMapImages, setFlowMapImages] = useState<UploadedImage[]>([]);
    const [showBoundTouchPointPrompt, setShowBoundTouchPointPrompt] = useState(false);
    const [showCustomAnnotationBox, setShowCustomAnnotationBox] = useState(false);
    const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
    const [currentTool, setCurrentTool] = useState<string>('select');
    const [newAnnotationPosition, setNewAnnotationPosition] = useState({ x: 0, y: 0 });
    const [showCreateTouchPointPrompt, setShowCreateTouchPointPrompt] = useState(false);
    const [showTooltips, setShowTooltips] = useState(true);
    const [pendingAnnotations, setPendingAnnotations] = useState<Annotation[]>([]);
    const [startingImageSrc, setStartingImageSrc] = useState<string | null>(null);
    const [savedAnnotations, setSavedAnnotations] = useState<Annotation[]>([]);
    const [savedFlowMapImages, setSavedFlowMapImages] = useState<UploadedImage[]>([]);
    const [flowMapNeedsUpdate, setFlowMapNeedsUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingFlowMapUpdates, setPendingFlowMapUpdates] = useState<Annotation[]>([]);
    const [hoveredAnnotation, setHoveredAnnotation] = useState<Annotation | null>(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [hasAnnotations, setHasAnnotations] = useState(false);


    /**
    * Prepares the annotation data for submission to the backend
    * @returns {Object} An object containing the formatted screen and annotation data
    */
    const prepareDataForBackend = () => {
      const screens = uploadedImages.map(image => ({
        id: image.id,
        image: image.filename,
        annotations: image.regions.map(annotation => ({
          id: annotation.name, // Assuming name is unique and can be used as ID
          label: annotation.name,
          coordinates: {
            x: annotation.x,
            y: annotation.y,
            width: annotation.width,
            height: annotation.height
          },
          leadsTo: annotation.navigateToId,
          isCorrectPath: annotation.isTrue
        }))
      }));
    
      // TODO: Replace these with actual values from your app's state or context
      const coreId = "user-core-id"; // You need to implement a way to get the actual user ID
      const testProjectId = "test-project-id"; // You need to implement a way to get the actual project ID
    
      return { screens, coreId, testProjectId };
    };


    const handleFinishSetUp = async () => {
      setIsSubmitting(true);
      setSubmitError(null);
    
      const data = prepareDataForBackend();
    
      try {
        const result = await onFinishSetUp(data);
        if (result && 'error' in result) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error submitting annotations:', error);
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit annotations. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    
    
    const generateUniqueId = (): string => {
      return uuidv4();
    };


    const handleToolChange = useCallback((tool: string) => {
        setCurrentTool(tool);
        if (tool === 'rectangle') {
          setShowCreateTouchPointPrompt(false);
          setShowBoundTouchPointPrompt(true);
        } else {
          setShowBoundTouchPointPrompt(false);
        }
      }, []);

      const handleImageUpload = useCallback((newImages: Omit<UploadedImage, 'id'>[]) => {
        setUploadedImages(prevImages => {
            const updatedImages = [
                ...prevImages,
                ...newImages.map(img => ({
                    ...img,
                    id: generateUniqueId(),
                })),
            ];
            return updatedImages.slice(0, 10); // Limit to 10 images
        });
        if (!hasSelectedFirstImage) {
            setShowSelectPrompt(true);
        }
    }, [hasSelectedFirstImage]);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setAnnotations(uploadedImages[index].regions || []);
    setShowSelectPrompt(false);
    if (!hasSelectedFirstImage) {
      setHasSelectedFirstImage(true);
      setStartingImageSrc(uploadedImages[index].src);
      setSavedFlowMapImages([uploadedImages[index]]);
      setShowCreateTouchPointPrompt(true);
    }
  }, [uploadedImages, hasSelectedFirstImage]);

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (newAnnotation && (newAnnotation.width !== 0 || newAnnotation.height !== 0)) {
      setAnnotations([...annotations, newAnnotation]);
      setCurrentAnnotation(newAnnotation);
      setShowCustomAnnotationBox(true);
      setNewAnnotationPosition({
        x: newAnnotation.x + newAnnotation.width + 10,
        y: newAnnotation.y
      });
      setShowBoundTouchPointPrompt(false);
    }
    setNewAnnotation(null);
  };

// Update the handleMouseDown function
const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
  if (currentTool !== 'rectangle' || selectedImageIndex === null) return;
  const stage = e.target.getStage();
  if (stage) {
    const pos = stage.getPointerPosition();
    if (pos) {
      setIsDrawing(true);
      setNewAnnotation({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        name: '',
        isTrue: true,
        navigateToId: '',
        imageSrc: uploadedImages[selectedImageIndex].src
      });
    }
  }
};

const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
  if (!isDrawing) return;
  const stage = e.target.getStage();
  if (stage) {
    const pos = stage.getPointerPosition();
    if (pos) {
      setNewAnnotation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          width: pos.x - prev.x,
          height: pos.y - prev.y,
        };
      });
    }
  }
};



  const handleSaveAnnotation = useCallback((annotationData: Omit<Annotation, 'imageSrc'>) => {
    if (currentAnnotation && selectedImageIndex !== null) {
      const currentImage = uploadedImages[selectedImageIndex];
      const updatedAnnotation: Annotation = {
        ...currentAnnotation,
        ...annotationData,
        imageSrc: currentImage.id,
      };

      // Check for duplicate annotation names
      const isDuplicateName = currentImage.regions.some(ann => ann.name === updatedAnnotation.name);
      if (isDuplicateName) {
        setErrorMessage("Error: An annotation with this name already exists on this image. Please choose a unique name.");
        return;
      }

      setPendingAnnotations(prev => [...prev, updatedAnnotation]);
      setAnnotations(prev => [...prev, updatedAnnotation]);
      // Remove this line to prevent immediate flow map update
      // setPendingFlowMapUpdates(prev => [...prev, updatedAnnotation]);
      setShowCustomAnnotationBox(false);
      setCurrentAnnotation(null);
      setShowTooltips(false);
    }
  }, [currentAnnotation, selectedImageIndex, uploadedImages]);

  const handleSaveAllAnnotations = useCallback(() => {
    if (selectedImageIndex !== null) {
      const currentImage = uploadedImages[selectedImageIndex];
      
      // Check if the current image is in the flow map
      if (!savedFlowMapImages.some(img => img.id === currentImage.id)) {
        setErrorMessage("Error: Please select an image that is already part of the flow map to annotate.");
        return;
      }
  
      const updatedImages = uploadedImages.map(img => 
        img.id === currentImage.id
          ? {
              ...img,
              regions: [...img.regions, ...pendingAnnotations],
              touchpoints: img.touchpoints + pendingAnnotations.length,
              trueTouchpoints: img.trueTouchpoints + pendingAnnotations.filter(a => a.isTrue).length,
              falseTouchpoints: img.falseTouchpoints + pendingAnnotations.filter(a => !a.isTrue).length,
              used: true,
            }
          : img
      );
  
      setUploadedImages(updatedImages);
      setSavedAnnotations(prev => [...prev, ...pendingAnnotations]);
  
      // Update savedFlowMapImages
      const newFlowMapImages = new Set(savedFlowMapImages);
      newFlowMapImages.add(currentImage);
      pendingAnnotations.forEach(annotation => {
        const targetImage = updatedImages.find(img => img.id === annotation.navigateToId);
        if (targetImage) {
          newFlowMapImages.add(targetImage);
        }
      });

      if (pendingAnnotations.length > 0) {
        setHasAnnotations(true);
      }
      
      setSavedFlowMapImages(Array.from(newFlowMapImages));
      setPendingAnnotations([]);
      setFlowMapNeedsUpdate(true);
      setPendingFlowMapUpdates(prev => [...prev, ...pendingAnnotations]);
      setErrorMessage(null);
    }
  }, [selectedImageIndex, uploadedImages, pendingAnnotations, savedFlowMapImages]);
    

  const handleDiscardAnnotation = useCallback(() => {
    if (currentAnnotation) {
      setAnnotations(annotations.filter(ann => ann !== currentAnnotation));
    }
    setShowCustomAnnotationBox(false);
    setCurrentAnnotation(null);
  }, [annotations, currentAnnotation]);

  const handleUpdateImage = useCallback((updatedImage: UploadedImage) => {
    setUploadedImages(prevImages => {
      const newImages = prevImages.map((img, index) => 
        index === selectedImageIndex ? updatedImage : img
      );
      setSavedFlowMapImages(prevFlowMapImages => 
        prevFlowMapImages.map(img => 
          img.src === updatedImage.src ? updatedImage : img
        )
      );
      return newImages;
    });
  }, [selectedImageIndex]);

  const AnnotationRect: React.FC<{ annotation: Annotation, isSelected: boolean, onSelect: () => void }> = ({ annotation, isSelected, onSelect }) => {
    const shapeRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);
  
    useEffect(() => {
      if (isSelected && trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, [isSelected]);
  
    return (
      <>
        <Rect
          ref={shapeRef}
          x={annotation.x}
          y={annotation.y}
          width={annotation.width}
          height={annotation.height}
          fill={annotation.isTrue ? 'rgba(63, 185, 80, 0.3)' : 'rgba(255, 72, 72, 0.3)'}
          stroke={annotation.isTrue ? '#3FB950' : '#FF4848'}
          strokeWidth={2}
          onClick={onSelect}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </>
    );
  };
  

  const handleAnnotationHover = (annotation: Annotation, e: KonvaEventObject<MouseEvent>) => {
    setHoveredAnnotation(annotation);
    const stage = e.target.getStage();
    if (stage) {
      const pos = stage.getPointerPosition();
      if (pos) {
        setHoverPosition({ x: pos.x + 10, y: pos.y + 10 });
      }
    }
  };

  const handleAnnotationLeave = () => {
    setHoveredAnnotation(null);
  };



  const renderAnnotations = () => {
    return annotations.map((annotation, index) => (
      <Group key={index}>
        <Rect
          x={annotation.x}
          y={annotation.y}
          width={annotation.width}
          height={annotation.height}
          fill={annotation.isTrue ? 'rgba(63, 185, 80, 0.3)' : 'rgba(255, 72, 72, 0.3)'}
          stroke={annotation.isTrue ? '#3FB950' : '#FF4848'}
          strokeWidth={2}
          onMouseEnter={(e) => handleAnnotationHover(annotation, e)}
          onMouseLeave={handleAnnotationLeave}
        />
      </Group>
    ));
  };


  const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ 
    src, 
    hoveredAnnotation, 
    setHoveredAnnotation, 
    hoverPosition, 
    setHoverPosition,
    handleAnnotationHover,
    handleAnnotationLeave,
    // ... other props
  }) => {
  
    const [image] = useImage(src);
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      if (containerRef.current && image) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const imageAspectRatio = image.width / image.height;
        const containerAspectRatio = containerWidth / containerHeight;
  
        let width, height;
        if (imageAspectRatio > containerAspectRatio) {
          width = containerWidth;
          height = containerWidth / imageAspectRatio;
        } else {
          height = containerHeight;
          width = containerHeight * imageAspectRatio;
        }
  
        setSize({ width, height });
      }
    }, [image]);
  
    const handleStageMouseLeave = () => {
      setHoveredAnnotation(null);
    };
  
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Stage
          width={size.width}
          height={size.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleStageMouseLeave}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                width={size.width}
                height={size.height}
              />
            )}
            {renderAnnotations()}
            {newAnnotation && (
              <Rect
                x={newAnnotation.x}
                y={newAnnotation.y}
                width={newAnnotation.width}
                height={newAnnotation.height}
                stroke="blue"
                strokeWidth={2}
              />
            )}
          </Layer>
        </Stage>
        {hoveredAnnotation && (
          <AnnotationHoverBox
            annotation={hoveredAnnotation}
            position={hoverPosition}
            images={uploadedImages}
          />
        )}
      </div>
    );
  };
  
  



  const filteredImages = uploadedImages.filter(image => 
    (showUsed && image.used) || (showNotUsed && !image.used)
  );

  const renderInterfaceItem = (image: UploadedImage, index: number) => {
    const isSelected = selectedImageIndex === index;
    return (
      <div
        key={image.id}
        className={`flex flex-col w-[93px] p-[10px_4px_0px_4px] items-center gap-[1px] rounded-[7px] ${
          isSelected ? 'border-[1.5px] border-[#625AFA]' : 'border border-[#505050]'
        } bg-[#151516] cursor-pointer`}
        onClick={() => handleImageSelect(index)}
      >
        <div className="w-[75px] h-[136px] relative mb-1">
          <Image
            src={image.src}
            alt={image.name}
            layout="fill"
            objectFit="cover"
            className="rounded-[7px]"
          />
        </div>
        <div className="w-[72px] h-[18px] text-[#C9D1D9] text-xs font-normal leading-[140%] truncate">
          {image.name}
        </div>
        <div className="w-[71px] h-[18px] text-[#505050] text-[10px] font-normal leading-[140%] truncate">
          {image.filename.split('.').slice(0, -1).join('.')}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <NavigationBar />
      <main className="flex flex-1 bg-[#0D1117]">
        <LeftSidebar 
          selectedImage={selectedImageIndex !== null ? uploadedImages[selectedImageIndex] : null}
          onUpdateImage={handleUpdateImage}
          onSaveAnnotations={handleSaveAllAnnotations}
          pendingAnnotationsCount={pendingAnnotations.length}
        />
    <div className="flex-1 flex flex-col">
      <AnnotationControls onToolChange={handleToolChange} currentTool={currentTool} />
      <div className="flex-1 overflow-hidden relative">
        {selectedImageIndex !== null ? (
          <AnnotatedImage 
            src={uploadedImages[selectedImageIndex].src}
            hoveredAnnotation={hoveredAnnotation}
            setHoveredAnnotation={setHoveredAnnotation}
            hoverPosition={hoverPosition}
            setHoverPosition={setHoverPosition}
            handleAnnotationHover={handleAnnotationHover}
            handleAnnotationLeave={handleAnnotationLeave}
            // ... other necessary props
          />
        ) : uploadedImages.length > 0 ? (
          <div className="flex items-center justify-center h-full text-white text-xl">
            Please select an image from the Interface Database to start annotating.
          </div>
        ) : (
          <UploadPrompt onImageUpload={handleImageUpload} />
        )}

    {showCustomAnnotationBox && currentAnnotation && (
      <div style={{ position: 'absolute', top: newAnnotationPosition.y, left: newAnnotationPosition.x }}>
        <CustomAnnotationBox
          onSave={handleSaveAnnotation}
          onDiscard={handleDiscardAnnotation}
          availablePages={uploadedImages}
          showTooltips={showTooltips}
          currentAnnotation={currentAnnotation}
        />
      </div>
    )}
          </div>
        </div>
        {/* Right sidebar */}
        <aside className="w-96 border-l border-[#333] bg-[#1C1D1F] p-3 flex flex-col relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#C9D1D9] text-sm font-medium">Interface Database</h3>
            <button 
              className="bg-[#625AFA] text-white text-xs py-1 px-3 rounded"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Upload Interface
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const newImages = files.map(file => ({
                  src: URL.createObjectURL(file),
                  name: file.name.split('.').slice(0, -1).join('.'),
                  filename: file.name,
                  regions: [],
                  used: false,
                  touchpoints: 0,
                  trueTouchpoints: 0,
                  falseTouchpoints: 0
                }));
                handleImageUpload(newImages);
              }}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="bg-[#0D1117] p-2 rounded flex-grow mr-2">
              <input type="text" placeholder="Search by name" className="w-full bg-transparent text-white text-sm" />
            </div>
            <div className="flex">
              <button
                className={`px-2 py-1 text-xs rounded-l ${showUsed ? 'bg-[#625AFA] text-white' : 'bg-[#21262D] text-[#8B949E]'}`}
                onClick={() => setShowUsed(!showUsed)}
              >
                Used
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-r ${showNotUsed ? 'bg-[#625AFA] text-white' : 'bg-[#21262D] text-[#8B949E]'}`}
                onClick={() => setShowNotUsed(!showNotUsed)}
              >
                Not Used
              </button>
            </div>
          </div>
          <div className="flex flex-nowrap gap-[10px] overflow-x-auto pb-16">
            {filteredImages.map((image, index) => renderInterfaceItem(image, index))}
          </div>
          {showSelectPrompt && (
            <div className="absolute top-[300px] left-0 w-full flex justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg relative">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
                <div className="text-[#625AFA] font-bold mb-2">Select your beginning page</div>
                <div className="text-sm">Start by annotating the beginning page of your user journey.</div>
              </div>
            </div>
          )}
          <h4 className="text-[#C9D1D9] text-sm font-medium mt-4 mb-2">Flow Map</h4>
          {errorMessage && (
          <div className="absolute top-4 right-4 bg-red-500 text-white p-4 rounded">
            {errorMessage}
          </div>
        )}
    <FlowMap 
      images={savedFlowMapImages} 
      annotations={savedAnnotations} // Remove pendingFlowMapUpdates from here
      startingImageId={savedFlowMapImages[0]?.id || null}
      needsUpdate={flowMapNeedsUpdate}
    />
<button 
  className={`mt-auto py-2 px-4 rounded ${
    hasAnnotations 
      ? 'bg-[#645CFA] text-white hover:bg-[#5449E8]' 
      : 'bg-[#5C5C60] text-[#BABABA] cursor-not-allowed'
  } ${isSubmitting ? 'opacity-50' : ''}`}
  onClick={handleFinishSetUp}
  disabled={isSubmitting || !hasAnnotations}
>
  {isSubmitting ? 'Submitting...' : 'Finish Set Up'}
</button>
{submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </aside>
      </main>
      {showCreateTouchPointPrompt && (
        <BoundingToolPrompt onClose={() => setShowCreateTouchPointPrompt(false)} />
      )}
      {showBoundTouchPointPrompt && (
        <BoundTouchPointPrompt onClose={() => setShowBoundTouchPointPrompt(false)} />
      )}
    </div>
  );
};

export default FrontPage;