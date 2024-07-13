'use client'
import React from 'react'
import { http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig, WagmiProvider } from '@privy-io/wagmi';


const queryClient = new QueryClient()

export const config = createConfig({
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(),
    },
})

function Providers({ children }: { children: React.ReactNode }) {



    return (
        <PrivyProvider
            appId="clyji9s9s0105lh1oyyrn1ao5"
            config={{
                appearance: {
                    theme: 'light',
                    accentColor: '#676FFF',
                    logo: 'https://your-logo-url',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >

            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>

                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    )
}

export default Providers