"use client"
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const NFCWriter: React.FC = () => {
    const [messageToWrite, setMessageToWrite] = useState<string>('Hola mundo');
    const { address } = useAccount()

    const handleWriteNFC = async () => {
        if(!address) return alert('No hay una cuenta conectada');
        try {
            const ndef = new window.NDEFReader();
            await ndef.write({
                records: [{ recordType: "text", data: address }],
            });
            alert(`Value Saved!`);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={messageToWrite}
                    onChange={(e) => setMessageToWrite(e.target.value)}
                    placeholder="Ingresa el mensaje a escribir en el tag NFC"
                />
                <button onClick={handleWriteNFC}>Escribir en NFC</button>
            </div>

        </div>
    );
};

export default NFCWriter;
