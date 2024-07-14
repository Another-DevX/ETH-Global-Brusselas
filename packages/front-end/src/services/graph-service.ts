
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



function getRandomHexColor() {
    // Genera un número aleatorio entre 0 y 16777215 (decimal) y lo convierte a hexadecimal
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Asegúrate de que el resultado tenga 6 caracteres, agregando ceros al inicio si es necesario
    return `#${randomColor.padStart(6, '0')}`;
}

const linkColor = (quality: string) => {

    return getRandomHexColor();
    switch (quality) {
        case "a":
            return "#FF0000";
        case "b":
            return "#00FF00";
        default:
            return "#000000";
    }
}

function abreviarTexto(texto) {
    if (texto.length <= 10) {
        return texto;
    }
    const primerosSeis = texto.slice(0, 6);
    const ultimosCuatro = texto.slice(-4);
    return `${primerosSeis}...${ultimosCuatro}`;
}

export const transformData = (data: any, depth: number = 4, currentNode: string) => {
    const nodes = new Set<string>();
    const links: { source: string, target: string }[] = [];
    currentNode = currentNode ?? data.connections[0].connector;
    const filteredData = subGraph(data.connections, currentNode, depth);


    filteredData.forEach((connection: any) => {
        const source = connection.connector;
        const target = connection.recipent;

        nodes.add(source);
        nodes.add(target);
        links.push({ source, target, color: linkColor('') });
    });

    const nodesArray = Array.from(nodes).map(id => ({
        id,
        name : abreviarTexto(id),
        color: (id == currentNode ? "#FF0000" : "#A6CEE3"),
        val: 15 
    }));
    console.log('Pintado', currentNode);
    let result = {
        nodes: nodesArray,
        links: links
    };
    return result;
}
