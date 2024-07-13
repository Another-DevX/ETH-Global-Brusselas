"use client"
import React, { useState, useEffect } from 'react';

const NFCWriter: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [messageToWrite, setMessageToWrite] = useState<string>('');

    const initializeNFCWriter = async () => {
        try {
            // Verificar si el navegador soporta la API NFC
            if ('NDEFReader' in window && 'NDEFWriter' in window) {
                setNfcSupported(true);
            } else {
                console.log('Web NFC no está soportado en este navegador.');
                return;
            }
        } catch (error) {
            console.error('Error al inicializar NFC:', error);
        }
    };

    const handleWriteNFC = async () => {
        try {
            const ndef: any = (window as any).NDEFReader();
            await ndef.scan();

            const ndefWriter: any = (window as any).NDEFWriter();
            await ndefWriter.write(messageToWrite);

            console.log('Mensaje escrito en el tag NFC:', messageToWrite);
            alert('Mensaje escrito correctamente en el tag NFC.');
        } catch (error) {
            console.error('Error al escribir NFC:', error);
            alert('Error al escribir NFC. Verifica la consola para más detalles.');
        }
    };

    return (
        <div>
            <button onClick={initializeNFCWriter}>Inicializar NFC</button>
            {nfcSupported ? (
                <div>
                    <input
                        type="text"
                        value={messageToWrite}
                        onChange={(e) => setMessageToWrite(e.target.value)}
                        placeholder="Ingresa el mensaje a escribir en el tag NFC"
                    />
                    <button onClick={handleWriteNFC}>Escribir en NFC</button>
                </div>
            ) : (
                <p>Web NFC no está soportado en este navegador.</p>
            )}
        </div>
    );
};

export default NFCWriter;
