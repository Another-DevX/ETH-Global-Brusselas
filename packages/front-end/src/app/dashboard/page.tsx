'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { gql, HttpLink, useQuery } from '@apollo/client';
import { transformData } from '@/services/graph-service';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";

import { useDashboardContext } from './config'



const Page = () => {
  const depth = useDashboardContext()
  const [currentNode, setCurrentNode] = useState(null);


  const GET_CONNECTIONS = gql`
  query {
    connections {
      id
      connector
      recipent
      blockNumber
    }
  }
`;

  const { error, data, loading } = useQuery(GET_CONNECTIONS);


  const fgRef = useRef();
  const handleClick = useCallback(node => {
    console.log(node);
    

    // Aim at node from outside it       

    fgRef.current.centerAt(
      node.x,
      node.y, // new position
      500  // ms transition duration
    );
    setTimeout(() => {
      fgRef.current.zoomToFit(500, 200);
      setCurrentNode(node.id);
    }, 500);



  }, [fgRef]);

  const [graphData, setGraphData] = useState<null | any>(null);

  useEffect(() => {
    if (loading) return;
    const graphData = transformData(data, depth, currentNode)
    console.debug(graphData)
    setGraphData(graphData);
  }, [loading, currentNode, depth])



  if (loading || !graphData) return <p>Loading...</p>

  const physics = {
    timeStep: 2,
    dimensions: 2,
    gravity: -12,
    theta: 0.8,
    springLength: 20,
    springCoefficient: 0.1,
    dragCoefficient: 0.1,
  };

  return (
    <ForceGraph2D
      ref={fgRef}
      onNodeClick={handleClick}

      /* ngraphPhysics={physics}
      nodeCanvasObject={(node, ctx, globalScale) => {
         const label = node.name;
         const fontSize = 12 / globalScale;
         ctx.font = `${fontSize}px Sans-Serif`;
         const textWidth = ctx.measureText(label).width;
         const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
 
         ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
         ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
 
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillStyle = node.color;
         ctx.fillText(label, node.x, node.y);
 
         node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
       }}
       nodePointerAreaPaint={(node, color, ctx) => {
         ctx.fillStyle = color;
         const bckgDimensions = node.__bckgDimensions;
         bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
         ctx.beginPath();
         ctx.arc(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[0] / 2, 5, 0, 2 * Math.PI, false);
         ctx.fill();
       }}*/
      nodeLabel='name'
      graphData={graphData}
    />
  );
};

export default Page;
