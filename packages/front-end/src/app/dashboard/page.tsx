'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { gql, HttpLink, useQuery } from '@apollo/client';
import { transformData } from '@/services/graph-service';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";

import { useDashboardContext } from './config'



function nodePaint({ id, x, y, color, name }, ctx) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
  ctx.fill();  // circle
  ctx.fillStyle = "#000000";
  ctx.font = '3px Sans-Serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x, y);  // text

}




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
    

    node.color = "#FF0000";
    // Aim at node from outside it       

    fgRef.current.centerAt(
      node.x,
      node.y, // new position
      500  // ms transition duration
    );
    setTimeout(() => {
      fgRef.current.zoomToFit(500, 100);
      setTimeout(() => {
        setCurrentNode(node.id);
      }, 500);
    }, 500);



  }, [fgRef]);

  const [graphData, setGraphData] = useState<null | any>(null);

  useEffect(() => {
    if (loading) return;
    const graphData = transformData(data, depth, currentNode)
    console.debug(graphData)
    setGraphData(graphData);
  }, [loading, currentNode, depth])



  if (loading || !graphData) return <span className='centered-span'>Loading...</span>



  return (
    <ForceGraph2D
      ref={fgRef}
      onNodeClick={handleClick}
      nodeCanvasObject={(node, ctx) => nodePaint(node, ctx)}
      // nodePointerAreaPaint={nodePaint}

      nodeLabel='name'
      graphData={graphData}
    />
  );
};

export default Page;
