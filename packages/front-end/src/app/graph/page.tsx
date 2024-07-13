'use client'

import React, { useCallback, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d';

const genRandomTree = (N = 20, reverse = false) => {
    const nodes = Array.from({ length: N }, (_, i) => ({ id: i.toString() }));
    const links = [];

    // Generar niveles de conexión
    for (let i = 1; i < N; i++) {
        const sourceId = Math.floor((i - 1) / 3);
        const targetId = i;
        links.push({
            [reverse ? 'target' : 'source']: sourceId.toString(),
            [reverse ? 'source' : 'target']: targetId.toString(),
        });
    }

    return { nodes, links };
};

function Page() {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState(genRandomTree());

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
            source: node.id.toString(),
            target: (parseInt(node.id) * 3 + i + 1).toString(),
        })).filter(link => parseInt(link.target) < graphData.nodes.length);

        setGraphData(genRandomTree());
    }, [fgRef, graphData.nodes.length]);

    return (
        <ForceGraph2D
            ref={fgRef}
            onNodeClick={handleClick}
            nodeAutoColorBy='group'
            graphData={graphData}
        />
    )
}

export default Page;
