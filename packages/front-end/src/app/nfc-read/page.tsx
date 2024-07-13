"use client"
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const NFCReader: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [tagContent, setTagContent] = useState<string>('');
    const { ready, login } = usePrivy();




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
                        // axios.post('/connect', {
                        //     user: address,
                        //     recipent: decodedPayload
                        // })
                        // alert(`Contenido del tag NFC: ${decodedPayload}`);
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
            <script src='assets/nfc.js'>
         
            </script>
            <span>Please scan:</span>
            <div>
                <button onClick={handleNfcReading}>Leer NFC</button>
                {tagContent && <p>Contenido del tag NFC: {tagContent}</p>}
            </div>

        </div>
    );
};

export default NFCReader;
