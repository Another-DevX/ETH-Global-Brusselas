import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';


import { ethers, Wallet } from 'ethers';
import { JsonRpcProvider } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const provider = new JsonRpcProvider('https://api.developer.coinbase.com/rpc/v1/base-sepolia/-Vw8g1mMB_R-hj9fmHC4BHh6M6pgi5Og');
    const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
    const eas = EAS__factory.connect('0x4200000000000000000000000000000000000021', wallet);
    const schemaEncoder = new SchemaEncoder('address user, address recipient');


    const { user, recipient } = await req.json()
    const encodedData = schemaEncoder.encodeData([
        { name: "user", value: user, type: "address" },
        { name: "recipient", value: recipient, type: "address" },
      ]);
      

    const tx = await eas.attest({
        schema:'',
        data: {
          recipient,
          data: encodedData,
          expirationTime: BigInt(0), 
          value: BigInt(0),
          refUID: ethers.ZeroHash,
          revocable: false,
        },
      });

      const receipt = await tx.wait()
      return NextResponse.json({ receipt });
}