
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
const getNode = (id: string, currentNode: string) => {


    if (id.toUpperCase() == "0x5E15DBf75d3819Dd9DA31Fc159Ce5bc5f3751AB0".toUpperCase()) {
        console.log("Lucho");
        return {
            id,
            name: abreviarTexto(id),
            label: "anotherdev.eth",
            color: (id.toUpperCase() == currentNode.toUpperCase() ? "#FF0000" : "#A6CEE3"),
            val: 15
        }

    }
    if (id.toUpperCase() == "0xA081e1dA16133bB4Ebc7Aab1A9B0588A48D15138".toUpperCase()) {
        console.log("Juampi");
        return {
            id,
            name: abreviarTexto(id),
            label: "jampol.eth",
            color: (id.toUpperCase() == currentNode.toUpperCase() ? "#FF0000" : "#A6CEE3"),
            val: 15
        }
    }
    return {
        id,
        name: abreviarTexto(id),
        label: id,
        color: (id.toUpperCase() == currentNode.toUpperCase() ? "#FF0000" : "#A6CEE3"),
        val: 15
    }

};
const getLink = (source: string, target: string) => {
    if (source.toUpperCase() == "0x5E15DBf75d3819Dd9DA31Fc159Ce5bc5f3751AB0".toUpperCase() ||
        target.toUpperCase() == "0x5E15DBf75d3819Dd9DA31Fc159Ce5bc5f3751AB0".toUpperCase() ||
        source.toUpperCase() == "0xA081e1dA16133bB4Ebc7Aab1A9B0588A48D15138".toUpperCase() ||
        target.toUpperCase() == "0xA081e1dA16133bB4Ebc7Aab1A9B0588A48D15138".toUpperCase()) {

        return {
            source, target,
            color: "#FF0000",
            width: 5
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

        nodes.add(source);
        nodes.add(target);
        links.push(getLink(
            source,
            target));
    });

    const nodesArray = Array.from(nodes).map(id => getNode(id, currentNode1));
    console.log(nodesArray);

    let result = {
        nodes: nodesArray,
        links: links
    };
    return result;
}
