// (If using Next.js - IDKitWidget must be run on client)
"use client"
import { NDEFReader } from '@/types/nfc';
import React, { useState, useEffect } from 'react';

const NFCReader: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [tagContent, setTagContent] = useState<string>('');

    useEffect(() => {
        // Verificar si el navegador soporta la API NFC
        if ('NDEFReader' in window) {
            setNfcSupported(true);
        } else {
            console.log('Web NFC no está soportado en este navegador.');
        }
    }, []);

    const handleNfcReading = async () => {
        try {
            const ndef: NDEFReader = window.NDEFReader;
            await ndef.scan();

            ndef.onreading = (event) => {
                const message = event.message;
                if (message.records.length > 0) {
                    const payload = message.records[0].data;
                    const textDecoder = new TextDecoder();
                    const decodedPayload = textDecoder.decode(payload);
                    setTagContent(decodedPayload);
                }
            };
        } catch (error) {
            console.error('Error al leer NFC:', error);
        }
    };

    return (
        <div>
            {nfcSupported ? (
                <div>
                    <button onClick={handleNfcReading}>Leer NFC</button>
                    {tagContent && <p>Contenido del tag NFC: {tagContent}</p>}
                </div>
            ) : (
                <p>Web NFC no está soportado en este navegador.</p>
            )}
        </div>
    );
};

export default NFCReader;
