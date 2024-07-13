import React from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

function Providers({ children }: { children: React.ReactNode }) {



    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Providers