// (If using Next.js - IDKitWidget must be run on client)
"use client"
import { IDKitWidget, ISuccessResult, useIDKit, VerificationLevel } from '@worldcoin/idkit'
import { BaseError, decodeAbiParameters, parseAbiParameters } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import abi from '../../constants/ConnectionManager.abi.json'


export default function WorldCoinPage() {

    const { data: hash, isPending, error, writeContractAsync } = useWriteContract()
    const account = useAccount()

    const verifyProof = async (proof: ISuccessResult) => {
        try {
            await writeContractAsync({
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                account: account.address!,
                abi,
                functionName: 'verifyAndExecute',
                args: [
                    account.address!,
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

    return (

        <IDKitWidget
            app_id="app_staging_4989e6a8b385ae6116fb36aeae08c250"
            action="verify-public-address"
            verification_level={VerificationLevel.Orb}
            handleVerify={verifyProof}
            onSuccess={onSuccess}>
            {({ open }) => (
                <button
                    onClick={open}
                >
                    Verify with World ID
                </button>
            )}
        </IDKitWidget>
    )
}