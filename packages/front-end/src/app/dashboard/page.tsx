'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { gql, HttpLink, useQuery } from '@apollo/client';
import { transformData } from '@/services/graph-service';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";





const Page = () => {

  const [depth, setDepth] = useState(0);

  function handleDepth() {
    setDepth(depth + 1);
  }

  const fgRef = useRef();
  const handleClick = useCallback(node => {

    fgRef.current.zoomToFit(
      500, 10);


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




  if (loading) return <p>Loading...</p>
  return (
    <div>
      <button onClick={handleDepth}>
        Increase Depth
      </button>
      <ForceGraph2D
        ref={fgRef}
        onNodeClick={handleClick}
        graphData={transformData(data, depth)}
      />
    </div>
  );
};

export default Page;
