'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {  gql, HttpLink, useQuery } from '@apollo/client';
import { subGraph, transformData } from '@/services/graph-service';



const filterData = (data: any, depth: number = 1)=>{
  console.log(data);
  return subGraph(data,data.nodes[0],  1);
}





const Page = () => {

  const fgRef = useRef();
  const handleClick = useCallback(node => {
    const distance = 10;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y);

    fgRef.current.centerAt(
      node.x,
      node.y,
      300
    );    
   

  }, [fgRef]);



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
  
  
  
 
  if(loading) return <p>Loading...</p>
  return (
    <ForceGraph2D
      ref={fgRef}
      onNodeClick={handleClick}

      nodeAutoColorBy='group'
      graphData={transformData(data)}
    />
  );
};

export default Page;
