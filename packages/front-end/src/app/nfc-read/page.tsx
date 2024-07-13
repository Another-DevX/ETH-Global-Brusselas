"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const NFCReader: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [tagContent, setTagContent] = useState<string>('');

    const { address } = useAccount()
    useEffect(() => {
        if ('NDEFReader' in window) {
            setNfcSupported(true);
        } else {
            console.log('Web NFC no está soportado en este navegador.');
        }
    }, []);

    const handleNfcReading = async () => {
        try {
            const ndef: any = (window as any).NDEFReader;
            await ndef.scan();

            ndef.onreading = (event: any) => {
                const message = event.message;
                if (message.records.length > 0) {
                    const payload = message.records[0].data;
                    if (!payload) return
                    const textDecoder = new TextDecoder();
                    const decodedPayload = textDecoder.decode(payload as ArrayBuffer);
                    setTagContent(decodedPayload);
                    axios.post('/connect', {
                        user: address,
                        recipent: decodedPayload
                    })
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
