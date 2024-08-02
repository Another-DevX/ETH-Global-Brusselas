
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



function abreviarTexto(texto) {
    if (texto.length <= 10) {
        return texto;
    }
    const primerosSeis = texto.slice(0, 6);
    const ultimosCuatro = texto.slice(-4);
    return `${primerosSeis}...${ultimosCuatro}`;
}
//Se define el label
const getNode = (id: string, currentNode: string, label: string) => {

    return {
        id,
        name: abreviarTexto(id),
        label: label ?? id,
        color: (id.toUpperCase() == currentNode.toUpperCase() ? "#FF0000" : "#A6CEE3"),
        val: 15
    }

};




//Se define el color del enlace
const getLink = (source: string, target: string, sourceVerified: boolean, targetVerified: boolean) => {
    if (sourceVerified && targetVerified) {
        return {
            source, target,
            color: "#FF0000",
            width: 5
        }
    }
    else if (sourceVerified || targetVerified) {
        return {
            source, target,
            color: "#00FF00",
            width: 3
        }
    }
    return { source, target, color: "#000", width: 2 };

};


export const transformData = (data: any, depth: number = 4, currentNode: string | null) => {
    const nodes = new Set<string>();
    const links: { source: string, target: string }[] = [];
    const currentNode1 = currentNode ?? data.connections[0].connector;
    const filteredData = subGraph(data.connections, currentNode1, depth);


    filteredData.forEach((connection: any) => {
        const source = connection.connector;
        const target = connection.recipent;
//Se lee el verified
        nodes.add(source);
        nodes.add(target);
        links.push(getLink(
            source,
            target,
            connection.connectorAccount.isVerfied,
            connection.recipentAccount.isVerfied
        ));
    });
//se lee el Ens
    const nodesArray = Array.from(nodes).map(id => getNode(id, currentNode1, connection.connectorAccount.ens));
    console.log(nodesArray);

    let result = {
        nodes: nodesArray,
        links: links
    };
    return result;
}
