// (If using Next.js - IDKitWidget must be run on client)
"use client"

import React, { useState } from 'react';


export default function NfcRead() {

    const [output, setOutput] = useState("Pulsa el botón para escanear una etiqueta NFC.");

  const handleScan = async () => {
    if ('NDEFReader' in window) {
      try {
        const ndef = new NDEFReader();
        await ndef.scan();
        setOutput("Esperando a que la etiqueta NFC esté cerca...");

        ndef.onreading = event => {
          const decoder = new TextDecoder();
          let newOutput = "";
          for (const record of event.message.records) {
            newOutput += `\nTipo de registro: ${record.recordType}`;
            newOutput += `\nMIME type: ${record.mediaType}`;
            newOutput += `\nContenido: ${decoder.decode(record.data)}\n`;
          }
          setOutput(newOutput);
        };

        ndef.onreadingerror = () => {
          setOutput("Error al leer la etiqueta NFC. Inténtalo de nuevo.");
        };
      } catch (error) {
        setOutput(`Error: ${error}`);
      }
    } else {
      setOutput("La API Web NFC no es compatible con este navegador.");
    }
  };

    return (
        <div>
          <h1>Lectura de datos NFC</h1>
          <button onClick={handleScan}>Escanear NFC</button>
          <pre>{output}</pre>
        </div>
      );
}