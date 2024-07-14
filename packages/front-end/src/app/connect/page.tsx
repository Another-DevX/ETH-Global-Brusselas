'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button, Spinner } from '@nextui-org/react'
import axios from 'axios'
import { createConfig, http, useAccount } from 'wagmi'
import { DynamicConnectButton, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import type { Address } from 'viem'
import { useEnsName } from 'wagmi'
import { mainnet } from 'viem/chains'

function Page() {
    const searchParams = useSearchParams()

    const { push } = useRouter()
    const [isConnecting, setIsConnecting] = useState(false)
    const { address } = useAccount()
    const connector = searchParams.get('address')
    const isLoggedIn = useIsLoggedIn();

    const config = createConfig({
        chains: [mainnet],
        transports: {
          [mainnet.id]: http('https://rpc.ankr.com/eth'),
        },
      })

    

    const result = useEnsName({
        address: connector as Address,
        chainId: mainnet.id,
        config
    })

    useEffect(() => {
        if (!connector) {
            push('/dashboard')
        }
    }, [connector])
    const handleConnect = async () => {

        try {
            setIsConnecting(true)
            const response = await axios.post('/api/connect', {
                user: address,
                recipient: connector
            })
            console.debug(response)
            setIsConnecting(false)
        } catch (e) {
            console.error(e)
        }
    }
    if (!connector) return null
    if (result.isLoading) return <div className='min-h-screen flex justify-center items-center '>

        <Spinner size='lg' label="Loading..." color="primary" />

    </div>
    console.debug(result)
    return (
        <div className='min-h-screen flex justify-center items-center flex-col gap-4'>
            <h2 className='text-lg font-semibold text-center'>Do you want to connect with {result.data ? result.data : `${connector.slice(0, 4)}...${connector.slice(-4)}`}?</h2>

            {
                isLoggedIn ? <div className='flex gap-2'>
                    <Button variant='shadow' color='primary' onClick={handleConnect} isLoading={isConnecting}>
                        Connect
                    </Button>
                    <Button variant='shadow' color='danger' >
                        Cancel
                    </Button>
                </div> :
                    <DynamicConnectButton>
                        <div className="px-4 py-2  bg-default rounded-md">
                            Log-In
                        </div>
                    </DynamicConnectButton>


            }

        </div>
    )
}

export default Page