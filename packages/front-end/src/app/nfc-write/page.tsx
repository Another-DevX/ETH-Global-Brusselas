"use client"
import React, { useState } from 'react';

function NfcWrite() {
  const [message, setMessage] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleWrite = async () => {
    if ('NDEFWriter' in window) {
      try {
        const ndef = new NDEFWriter();
        await ndef.write({ records: [{ recordType: 'text', data: message }] });
        setOutput('¡Escritura exitosa en la etiqueta NFC!');
      } catch (error) {
        setOutput(`Error al escribir en la etiqueta NFC: ${error}`);
      }
    } else {
      setOutput('La API Web NFC no es compatible con este navegador.');
    }
  };

  return (
    <div>
      <h1>Escribir datos en una etiqueta NFC</h1>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Escribe tu mensaje aquí"
      />
      <button onClick={handleWrite}>Escribir en NFC</button>
      <pre>{output}</pre>
    </div>
  );
}

export default NfcWrite;
