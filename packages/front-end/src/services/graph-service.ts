
//@ts-nocheck

function subGraph(connections: any[], startNode: string, distance: number) {

    let currrentDistance = distance;
    let filteredConnections = connections.filter(x => x.connector == startNode || x.recipent == startNode);
    currrentDistance--;
    let additionalConnections: any[] = [];
    while (currrentDistance > 0) {
        filteredConnections.forEach(x => {
            let currentNode = x.connector == startNode ? x.recipent : x.connector;
            additionalConnections.push(...subGraph(connections, currentNode, currrentDistance));
        });
        console.log('Filtered:', filteredConnections);
        console.log('Add', additionalConnections);
        filteredConnections = mergeArraysUnique(filteredConnections, additionalConnections);
        currrentDistance--;
    }


    return filteredConnections;
}

function mergeArraysUnique(array1, array2) {
    const combinedArray = array1.concat(array2);
    const uniqueArray = combinedArray.filter((item, index) => combinedArray.indexOf(item) === index);
    return uniqueArray;
}

export const transformData = (data: any, currentNode: string =  data.connections[1].connector, depth: number = 2) => {
    const nodes = new Set<string>();
    const links: { source: string, target: string }[] = [];

    const filteredData = subGraph(data.connections, currentNode, depth);


    filteredData.forEach((connection: any) => {
        const source = connection.connector;
        const target = connection.recipent;

        nodes.add(source);
        nodes.add(target);
        links.push({ source, target });
    });
    
    const nodesArray = Array.from(nodes).map(id => ({ id, color: (id == currentNode ? "#FF0000" : "#A6CEE3") }));

    let result = {
        nodes: nodesArray,
        links: links
    };
    console.log(currentNode);
    console.log(result);
    return result;
}
