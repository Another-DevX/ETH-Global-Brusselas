import { createPublicClient, createWalletClient, http } from 'viem'
import abi from '@/constants/ConnectionManager.abi.json'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'


export async function POST(req: Request, res: Response) {

    const { user, recipent } = await req.json()

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http()
    })

    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
        
    const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http()
      })

    const { request } = await publicClient.simulateContract({
        account,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'connect',
        args: [user, recipent]
    })
    await walletClient.writeContract(request)

}