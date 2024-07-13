'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const genRandomTree = (N = 20, reverse = false) => {
    const nodes = Array.from({ length: N }, (_, i) => ({ id: i }));
    const links = [];

    // Generar niveles de conexión
    for (let i = 1; i < N; i++) {
        const sourceId = Math.floor((i - 1) / 3);
        const targetId = i;
        links.push({
            [reverse ? 'target' : 'source']: sourceId,
            [reverse ? 'source' : 'target']: targetId,
        });
    }

    return { nodes, links };
};

const Page = () => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState(genRandomTree(20));


  const handleClick = useCallback(node => {
    const distance = 10;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y);

    fgRef.current.centerAt(
        node.x,
        node.y, 
        300  
    );
    // fgRef.current.zoom(
    //     5, 3000
    // );

    // Generar nuevas conexiones desde el nodo clicado
    const newLinks = Array.from({ length: 3 }, (_, i) => ({
        source: node.id,
        target: (graphData.nodes.length + i).toString(),
    }));


    setGraphData(prevData => {
        const { nodes, links } = prevData;
        const id = nodes.length;
        return {
          nodes: [...nodes, { id }],
          links: [...links, { source: id, target: Math.round(Math.random() * (id - 1)) }]
        };
      })
  }, [fgRef, graphData.nodes.length]);

  return (
    <ForceGraph2D
      ref={fgRef}
      onNodeClick={handleClick}
      nodeAutoColorBy='group'
      graphData={graphData}
    />
  );
};

export default Page;
