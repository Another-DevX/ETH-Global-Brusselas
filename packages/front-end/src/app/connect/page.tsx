'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button, Link, Spinner } from '@nextui-org/react'
import axios from 'axios'
import { createConfig, http, useAccount } from 'wagmi'
import { DynamicConnectButton, DynamicWidget, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import type { Address } from 'viem'
import { useEnsName } from 'wagmi'
import { mainnet } from 'viem/chains'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    ModalFooter
} from "@nextui-org/modal";

function Page() {
    const searchParams = useSearchParams()

    const { push } = useRouter()
    const [isConnecting, setIsConnecting] = useState(false)
    const [receipt, setReceipt] = useState('')
    const { address, isConnected } = useAccount()
    const isLoggedIn = useIsLoggedIn()
    const connector = searchParams.get('address')


    const config = createConfig({
        chains: [mainnet],
        transports: {
            [mainnet.id]: http('https://rpc.ankr.com/eth'),
        },
    })
    const { isOpen, onOpen, onOpenChange } = useDisclosure();




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
                user: connector,
                recipient: address
            })
            console.debug(response)
            setReceipt(response.data.receipt)
            onOpen()
            setIsConnecting(false)
        } catch (e) {
            console.error(e)
            setIsConnecting(false)
            alert(e)
        }
    }

    if (result.isLoading) return <div className='min-h-screen flex justify-center items-center '>  <Spinner size='lg' label="Loading..." color="primary" /> </div>
    if (typeof window !== "undefined") return (
        <div className='min-h-screen flex justify-center items-center flex-col gap-4'>
            <h2 className='text-lg font-semibold text-center'>Do you want to connect with {result.data ? result.data : `${connector!.slice(0, 4)}...${connector!.slice(-4)}`}? <br /> 🤝</h2>
            <DynamicWidget />

            {
                isConnected && isLoggedIn && <div className='flex gap-2'>
                    <Button variant='shadow' color='primary' onClick={handleConnect} isLoading={isConnecting}>
                        Connect
                    </Button>
                    <Button variant='shadow' color='danger' >
                        Cancel
                    </Button>
                </div>
            }
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Connection succesful</ModalHeader>
                            <ModalBody>
                                <p>Congratulations, you&apos;ve successfully connected with each other!</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button href={`https://sepolia.basescan.org/tx/${receipt}`} as={Link}
                                    showAnchorIcon color="primary" onPress={onClose}>
                                    Go to txn
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page
