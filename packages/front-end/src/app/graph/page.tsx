'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const getGraphInfo = ()=> {

  
};

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.studio.thegraph.com/query/83101/multi-plug/version/latest' }), // Reemplaza 'YOUR_GRAPHQL_API_URL' con la URL de tu API GraphQL
  cache: new InMemoryCache()
});

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

function transformData(data: any) {
  const nodes = new Set<string>();
  const edges: { source: string, target: string }[] = [];

  data.connections.forEach((connection: any) => {
    const source = connection.connector;
    const target = connection.recipent;
    nodes.add(source);
    nodes.add(target);
    edges.push({ source, target });
  });

  const nodesArray = Array.from(nodes).map(id => ({ id }));
  
  return {
    nodes: nodesArray,
    edges: edges
  };
}

// Función para obtener y procesar los datos
async function fetchGraphData() {
  try {
    const result = await client.query({ query: GET_CONNECTIONS });    
    return transformData(result.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



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
  const [graphData, setGraphData] = useState(fetchGraphData());


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
