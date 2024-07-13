"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';


const NFCReader: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [tagContent, setTagContent] = useState<string>('');
    const { address } = useAccount()



    const handleNfcReading = async () => {

        if ("NDEFReader" in window) {

            try {
      
                const ndef = new (window as any).NDEFReader()
      
                await ndef.scan();
                alert('Please scan!');
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
                alert('Error al leer NFC:' + error);
            }
        } else {
            alert('NFC not present!');
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
