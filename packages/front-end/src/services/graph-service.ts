export const subGraph = (grafo: any, currentNode: any, distancia: number) => {

    const nodoInicial = currentNode;
    const adyacencia = new Map();
    grafo.nodes.forEach(node => adyacencia.set(node.id, []));
    grafo.links.forEach(link => {
        adyacencia.get(link.source).push(link.target);
        adyacencia.get(link.target).push(link.source);
    });


    const cola = [[nodoInicial, 0]];
    const visitados = new Set();
    const nodosEnDistancia = new Set();

    while (cola.length > 0) {
        const [nodo, dist] = cola.shift();
        if (dist > distancia) continue;
        if (!visitados.has(nodo)) {
            visitados.add(nodo);
            if (dist === distancia) {
                nodosEnDistancia.add(nodo);
            }
            // console.log(nodo);
            // console.log(adyacencia);
            // debugger

            let adyacentes = adyacencia.get(nodo.id);
            if (adyacentes)
                adyacencia.get(nodo.id).forEach(adyacente => {
                    if (!visitados.has(adyacente)) {
                        cola.push([adyacente, dist + 1]);
                    }
                });
        }
    }

    const subgrafo = {
        nodes: Array.from(nodosEnDistancia).map(id => ({ id })),
        links: grafo.links.filter(
            link => nodosEnDistancia.has(link.source) && nodosEnDistancia.has(link.target)
        )
    };

    return subgrafo;
}

export const transformData = (data: any) => {
    const nodes = new Set<string>();
    const links: { source: string, target: string }[] = [];
    data.connections.forEach((connection: any) => {
        const source = connection.connector;
        const target = connection.recipent;
        nodes.add(source);
        nodes.add(target);
        links.push({ source, target });
    });

    const nodesArray = Array.from(nodes).map(id => ({ id }));

    let result = {
        nodes: nodesArray,
        links: links
    };
    console.log(result);
    result = subGraph(result, result.nodes[0], 1);

    return result;
}
