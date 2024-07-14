'use client'
import React from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { baseSepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';


const queryClient = new QueryClient()


export const config = createConfig({
    chains: [baseSepolia, mainnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [baseSepolia.id]: http(),
        [mainnet.id]: http()
    },
})

function Providers({ children }: { children: React.ReactNode }) {
    const client = new ApolloClient({
        uri: 'https://api.studio.thegraph.com/query/83101/multi-plug/version/latest',
        cache: new InMemoryCache()
    });



    return (
        <DynamicContextProvider
            settings={{
                environmentId: "1950d097-0c06-4589-af21-f02e3f165c10",
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <WagmiProvider config={config}>
                <ApolloProvider client={client}>
                    <QueryClientProvider client={queryClient}>
                        <DynamicWagmiConnector>

                            <NextUIProvider>
                                {children}
                            </NextUIProvider>
                        </DynamicWagmiConnector>

                    </QueryClientProvider>
                </ApolloProvider>
            </WagmiProvider>
        </DynamicContextProvider>

    )
}

export default Providers