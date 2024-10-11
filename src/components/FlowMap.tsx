import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { UploadedImage, Annotation } from './FrontPage';

interface FlowMapProps {
  images: UploadedImage[];
  annotations: Annotation[];
  startingImageId: string | null;
  needsUpdate: boolean;
}

interface FlowMapNode {
    id: string;
    image: UploadedImage;
    connections: {
        target: string;
        annotation: Annotation;
    }[];
    level: number;
    horizontalPosition: number;
}

const FlowMap: React.FC<FlowMapProps> = ({ images, annotations, startingImageId, needsUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [, forceUpdate] = useState({});
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    if (needsUpdate) {
      forceUpdate({});
    }
  }, [needsUpdate, annotations]); // Add annotations to the dependency array

  const flowMap = useMemo(() => {
    const nodeMap = new Map<string, FlowMapNode>();

    // Create nodes for all images
    images.forEach(image => {
      if (!nodeMap.has(image.id)) {
        nodeMap.set(image.id, {
          id: image.id,
          image,
          connections: [],
          level: 0,
          horizontalPosition: 0,
        });
      }
    });

    // Process annotations to create connections
    annotations.forEach(annotation => {
      const sourceNode = nodeMap.get(annotation.imageSrc);
      const targetNode = nodeMap.get(annotation.navigateToId);
      if (sourceNode && targetNode) {
        sourceNode.connections.push({
          target: targetNode.id,
          annotation,
        });
      }
    });

    // Assign levels and horizontal positions
    const assignLevelsAndPositions = (nodeId: string, level: number, horizontalPosition: number, visited = new Set<string>()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node) return;

      node.level = Math.max(node.level, level);
      node.horizontalPosition = Math.max(node.horizontalPosition, horizontalPosition);

      let trueCount = 0;
      let falseCount = 0;
      node.connections.forEach(connection => {
        if (connection.annotation.isTrue) {
          assignLevelsAndPositions(connection.target, level + 1, horizontalPosition + trueCount * 0.5, visited);
          trueCount++;
        } else {
          assignLevelsAndPositions(connection.target, level, horizontalPosition + falseCount * 0.5 + 1, visited);
          falseCount++;
        }
      });
    };

    if (startingImageId) {
      const startingNode = nodeMap.get(startingImageId);
      if (startingNode) {
        assignLevelsAndPositions(startingNode.id, 0, 0);
      }
    }

    return Array.from(nodeMap.values());
  }, [images, annotations, startingImageId]);

  const renderConnections = (node: FlowMapNode) => {
    const trueConnections = node.connections.filter(c => c.annotation.isTrue);
    const falseConnections = node.connections.filter(c => !c.annotation.isTrue);

    const renderPath = (connection: typeof node.connections[0], index: number, isTrue: boolean, total: number) => {
      const targetNode = flowMap.find(n => n.id === connection.target);
      if (!targetNode) return null;

      const startX = node.horizontalPosition * 200 + 60;
      const startY = node.level * 200 + 60;
      const endX = targetNode.horizontalPosition * 200 + 60;
      const endY = targetNode.level * 200 + 60;

      const color = isTrue ? '#3FB950' : '#FF4848';
      
      // Adjust the control points to create curved paths
      const midY = (startY + endY) / 2;
      const offset = isTrue ? 30 : -30;
      const curveOffset = (index - (total - 1) / 2) * offset;

      let path;
      let textPosition;
      if (isTrue) {
        const controlPoint1X = startX;
        const controlPoint1Y = midY + curveOffset;
        const controlPoint2X = endX;
        const controlPoint2Y = midY + curveOffset;
        path = `M${startX},${startY} C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;
        textPosition = {
          x: (startX + endX) / 2,
          y: midY + curveOffset - 15 // Move text above the curve
        };
      } else {
        const controlPoint1X = startX + curveOffset;
        const controlPoint1Y = startY;
        const controlPoint2X = endX + curveOffset;
        const controlPoint2Y = endY;
        path = `M${startX},${startY} C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;
        textPosition = {
          x: ((startX + endX) / 2) + curveOffset + 15, // Move text to the right of the curve
          y: (startY + endY) / 2
        };
      }

      const pathId = `${node.id}-${connection.target}-${index}`;

      return (
        <g key={pathId}>
          <path
            d={path}
            stroke={color}
            strokeWidth={2}
            fill="none"
            onMouseEnter={() => setHoveredPath(pathId)}
            onMouseLeave={() => setHoveredPath(null)}
          />
          {hoveredPath === pathId && (
            <g>
              <rect
                x={textPosition.x - 50}
                y={textPosition.y - 10}
                width={100}
                height={20}
                fill="white"
                opacity={0.8}
                rx={5}
                ry={5}
              />
              <text
                x={textPosition.x}
                y={textPosition.y}
                fill={color}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
              >
                {connection.annotation.name}
              </text>
            </g>
          )}
        </g>
      );
    };

    return [
      ...trueConnections.map((conn, index) => renderPath(conn, index, true, trueConnections.length)),
      ...falseConnections.map((conn, index) => renderPath(conn, index, false, falseConnections.length)),
    ];
  };

  const renderNode = (node: FlowMapNode) => {
    return (
      <div
        key={node.id}
        className="absolute"
        style={{
          top: `${node.level * 200}px`,
          left: `${node.horizontalPosition * 200}px`,
        }}
      >
        <div className="flex flex-col items-center p-2 border border-[#625AFA] rounded-md bg-[#2D2D2D] w-24">
          <Image
            src={node.image.src}
            alt={node.image.name}
            width={49}
            height={105}
            objectFit="cover"
          />
          <span className="text-[#C9D1D9] text-xs mt-1">{node.image.name}</span>
        </div>
      </div>
    );
  };

  const filteredFlowMap = flowMap.filter(node =>
    node.image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0D1117] rounded-xl p-3 h-[510px] overflow-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-36 bg-transparent text-[#505050] text-sm border-b border-[#505050] pb-1 focus:outline-none focus:border-[#625AFA]"
        />
      </div>
      <div className="relative" style={{ height: '1500px', width: '1500px' }}>
        <svg className="absolute top-0 left-0 w-full h-full">
          {filteredFlowMap.flatMap(renderConnections)}
        </svg>
        {filteredFlowMap.length > 0 ? (
          filteredFlowMap.map(renderNode)
        ) : (
          <p className="text-[#C9D1D9]">
            {images.length === 0
              ? "No images uploaded yet. Upload images and create annotations to see the flow map."
              : annotations.length === 0
              ? "No annotations saved yet. Create and save annotations to see the flow map."
              : "No matching images found. Try adjusting your search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlowMap;