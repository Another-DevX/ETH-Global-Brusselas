// // 'use client';

// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import ForceGraph2D from 'react-force-graph-2d';
// import {  gql, HttpLink, useQuery } from '@apollo/client';
// import { subGraph, transformData } from '@/services/graph-service';





// const Page = () => {

//   const fgRef = useRef();
//   const handleClick = useCallback(node => {
//     const distance = 10;
//     const distRatio = 1 + distance / Math.hypot(node.x, node.y);

//     fgRef.current.centerAt(
//       node.x,
//       node.y,
//       300
//     );    
   

//   }, [fgRef]);



//   const GET_CONNECTIONS = gql`
//   query {
//     connections {
//       id
//       connector
//       recipent
//       blockNumber
//     }
//   }
// `;


//   const { error, data, loading } = useQuery(GET_CONNECTIONS);
  
  
  
 
//   if(loading) return <p>Loading...</p>
//   return (
//     <ForceGraph2D
//       ref={fgRef}
//       onNodeClick={handleClick}
//       nodeAutoColorBy='group'
//       graphData={graphData}
//     />
//   );
// };

// export default Page
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page