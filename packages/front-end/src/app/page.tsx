'use client'
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import { IDKitWidget, ISuccessResult, useIDKit, VerificationLevel } from '@worldcoin/idkit'
import { BaseError, decodeAbiParameters, parseAbiParameters } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import abi from '@/constants/ConnectionManager.abi.json'
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const { writeContractAsync } = useWriteContract()
  const { isConnected, address } = useAccount()
  const router = useRouter()




  const verifyProof = async (proof: ISuccessResult) => {
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        account: address!,
        abi,
        functionName: 'verifyPublicAddress',
        args: [
          address!,
          BigInt(proof!.merkle_root),
          BigInt(proof!.nullifier_hash),
          decodeAbiParameters(
            parseAbiParameters('uint256[8]'),
            proof!.proof as `0x${string}`
          )[0],
        ],
      })
      console.debug('Proof verified')
    } catch (error) { throw new Error((error as BaseError).shortMessage) }
  }

  const onSuccess = () => {
    console.log("Success")
  };

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard')
    }
  }, [isConnected])
  return (
    <main className="flex min-h-screen flex-col gap-10 items-center justify-center">
      <h2 className="text-4xl font-bold text-center" ><span className="title-color" >PROOF PALS</span><br /> 🤝</h2>
      <h2 className="text-4xl font-bold text-center">Welcome to the new era of <br /> Social Media</h2>
      <DynamicWidget

        variant="dropdown"
      />


      {/* <Card className="min-w-96">
        <CardHeader>
          <h2>Dynamic Widget</h2>
        </CardHeader>
        <CardBody>
          <DynamicWidget />
          <IDKitWidget
            app_id="app_staging_4989e6a8b385ae6116fb36aeae08c250"
            action="verify-public-address"
            verification_level={VerificationLevel.Orb}
            onSuccess={verifyProof}
            signal={account.address}

          >
            {({ open }) => (
              <Button className="flex gap-2" onClick={open} variant="bordered">
                <img src="https://cryptologos.cc/logos/worldcoin-org-wld-logo.png"
                  className="w-4 h-4"
                />
                Verify with worldcoin</Button>
            )}
          </IDKitWidget>
        </CardBody>
      </Card> */}
    </main >
  );
}
