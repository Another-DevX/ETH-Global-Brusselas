
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
        label: mapping[id] ?? id,
        color: (id.toUpperCase() == currentNode.toUpperCase() ? "#FF0000" : "#A6CEE3"),
        val: 15
    }

};


const mapping = {
    '0x5b92733e11612c540bae7e6b8e188de42b66d80c': "vitalik.eth",
    '0x7054c7fbce11387ef2ff9b698bb3b7fad93e6640': "brantly.eth",
    '0x352792f81ab67a2322a61b71de1b1987faf9f013': "ethereum.eth",
    '0xe0532b7f26dec25f9c8cc4d4fbeccd7d2426e8e0': "defi.eth",
    '0x479ab89466df154fbf63bafe7b6481c6189b0b67': "metamask.eth",
    '0x45bc8575cddc0fee674ca821463e5472ac56fe89': "pepito.eth",
    '0x5dcb5a256023d19231a5327fef1f172e90251400': "filanito.eth",
    '0x005f16f017aa933bb41965b52848ceb8ee48b171': "argentino.eth",
    '0x1726cf86da996bc4b2f393e713f6f8ef83f2e4f6': "luchito.eth",
    '0x1d723baba4b24768f05ee27e8935fb42a664cb76': "blockchain.eth",
    '0x4d93536aa77fe4fdd48dc7f2c228410ec49c233c': "holamundo.eth",
    '0xef45f4597793a09971ba10727e9222b7826ec4f4': "chaomundo.eth",
    '0x8584cc5c32374660f1a9f796b1dd4ff608f9e1ae': "prueba.eth",
    '0xa0438d68ff275802ec75590cf452f710c50a68f2': "alguien.eth",
    '0xaa104aa7a71df47f8c458a5c2a331fb75be5b12e': "johndoe.eth",
    '0x42a35acd96845a876df570ee35b1e1b4920e41c0': "johanadoe.eth"


}
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
