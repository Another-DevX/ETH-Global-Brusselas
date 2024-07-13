// (If using Next.js - IDKitWidget must be run on client)
"use client"
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'


function WorldCoinPage() {

    // TODO: Calls your implemented server route
    const verifyProof = async (proof) => {
        throw new Error("TODO: verify proof server route")
    };

    // TODO: Functionality after verifying
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
export { WorldCoinPage }