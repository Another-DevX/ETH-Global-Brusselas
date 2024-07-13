'use client'
import React from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'


const queryClient = new QueryClient()

export const config = createConfig({
    chains: [baseSepolia],
    multiInjectedProviderDiscovery: false,
    transports: {
        [baseSepolia.id]: http(),
    },
})

function Providers({ children }: { children: React.ReactNode }) {



    return (
        <DynamicContextProvider
        settings={{
          environmentId: "1950d097-0c06-4589-af21-f02e3f165c10",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
      
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    <NextUIProvider>
                        {children}
                    </NextUIProvider>
                </WagmiProvider>
            </QueryClientProvider>
      </DynamicContextProvider>

    )
}

export default Providers