"use client"
import ForceGraph3D from 'react-force-graph-3d';


export default function Network() {

    const myData = {
        "nodes": [ 
            { 
              "id": "id1",
              "name": "name1",
              "val": 1 
            },
            { 
              "id": "id2",
              "name": "name2",
              "val": 10 
            }
        ],
        "links": [
            {
                "source": "id1",
                "target": "id2"
            }
        ]
    };

    return (

        <ForceGraph3D
            graphData={myData}
        />
    )
}
