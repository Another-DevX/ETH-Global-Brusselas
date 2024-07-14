'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { gql, HttpLink, useQuery } from '@apollo/client';
import { transformData } from '@/services/graph-service';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";

import { useDashboardContext } from './config'
import { useIsClient } from '@/hooks/useIsClient';
import { useAccount } from 'wagmi';



function nodePaint({ id, x, y, color, name }: { id: number, x: number, y: number, color: string, name: string }, ctx: any) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 5 * Math.PI, false);
  ctx.fill();  // circle
  ctx.fillStyle = "#000000";
  ctx.font = '2.7px Sans-Serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x, y);  // text

}




const Graph = () => {
  const depth = useDashboardContext()
  const { address } = useAccount();
  const [currentNode, setCurrentNode] = useState(address?.toLowerCase() as string);


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


  const fgRef = useRef<any | null>(null);
  const handleClick = useCallback((node: any) => {


    node.color = "#FF0000";
    // Aim at node from outside it       

    fgRef.current.centerAt(
      node.x,
      node.y, // new position
      500  // ms transition duration
    );
    setTimeout(() => {
      setCurrentNode(node.id);
      setTimeout(() => {
        fgRef.current.zoomToFit(500, 100);
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
  const isClient = useIsClient();


  if (!isClient) return null;
  if (loading || !graphData) return <span className='centered-span'>Loading...</span>



  return (
    <ForceGraph2D
      ref={fgRef}
      height={window.screen.height - 230}
      onNodeClick={handleClick}
      nodeCanvasObject={(node, ctx) => nodePaint(node, ctx)}
      linkWidth='width'
      nodeLabel='label'
      graphData={graphData}
    />

  );
};

export default Graph;
