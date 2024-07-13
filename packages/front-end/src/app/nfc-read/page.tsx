"use client"
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';


const NFCReader: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [tagContent, setTagContent] = useState<string>('');
    const { ready, login } = usePrivy();
    const { address } = useAccount()



    const handleNfcReading = async () => {

        if ("NDEFReader" in window) {

            try {
                const ndef: any = (window as any).NDEFReader;
                alert('NFC Reader is ready');
                await ndef.scan();

                ndef.onreading = (event: any) => {

                    if (event.message.records.length > 0) {
                        const decoder = new TextDecoder();
                        const payload = decoder.decode(event.message.records[0].data);
                        if (!payload) return
                        alert(payload);
                        setTagContent(payload);
                        axios.post('/connect', {
                            user: address,
                            recipent: payload
                        })
                    }
                };
            } catch (error) {
                console.error('Error al leer NFC:', error);
            }
        } else {
            alert('hola');
        }

    };

    return (
        <div>
            <span>Please scan:</span>
            <div>
                <button onClick={handleNfcReading}>Leer NFC</button>
                {tagContent && <p>Contenido del tag NFC: {tagContent}</p>}
            </div>

        </div>
    );
};

export default NFCReader;
