'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import axios from 'axios'
import { useAccount } from 'wagmi'
import { DynamicConnectButton, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'

function Page() {
    const searchParams = useSearchParams()
    const { push } = useRouter()
    const [isConnecting, setIsConnecting] = useState(false)
    // const { address } = useAccount()
    // const connector = searchParams.get('address')
    // const isLoggedIn = useIsLoggedIn();

    // useEffect(() => {
    //     if (!connector) {
    //         push('/dashboard')
    //     }
    // }, [connector])  
    // const handleConnect = async () => {
    //     try {
    //         setIsConnecting(true)
    //         await axios.post('/connect', {
    //             user: address,
    //             recipent: connector
    //         })
    //         setIsConnecting(false)
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }
    return (
        <div className='min-h-screen flex justify-center items-center flex-col gap-4'>
            <h2 className='text-lg font-semibold text-center'>Do you want to connect with anotherdev.eth?</h2>

            {/* {
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


            } */}

        </div>
    )
}

export default Page