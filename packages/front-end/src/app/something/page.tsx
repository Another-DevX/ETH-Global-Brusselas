'use client'
import { DynamicConnectButton, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core'
import React from 'react'
import { useAccount } from 'wagmi'

function page() {
    const { address, isConnected } = useAccount()
    const context = useDynamicContext()


    return (
        <>
            <DynamicWidget />

            <div>isConnected: {isConnected ? 'true' : 'false'}</div>
            <div>address: {address}</div>
        </>
    )
}

export default page