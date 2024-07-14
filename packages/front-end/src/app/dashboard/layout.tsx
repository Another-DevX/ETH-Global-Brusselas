
'use client'
import React, { createContext, useContext, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input, Slider } from "@nextui-org/react";
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import abi from '@/constants/ConnectionManager.abi.json'
import { useRouter } from "next/navigation";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { BaseError, decodeAbiParameters, parseAbiParameters } from "viem";
import { SearchIcon } from "@/components/SearchIcon";
import { DynamicConnectButton, DynamicWidget, useIsLoggedIn, useWalletItemActions } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

export const DashboardContext = createContext(3);

export const useDashboardContext = () => {
    return useContext(DashboardContext);
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { address } = useAccount()
    const [depth, setDepth] = useState(3)

    const result = useReadContract({
        abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        functionName: '_isVerified',
        args: [address!],

    })


    const { writeContractAsync } = useWriteContract()
    const account = useAccount()
    const router = useRouter()
    const { handleLogOut } = useDynamicContext();



    const verifyProof = async (proof: ISuccessResult) => {
        try {
            console.debug(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
            console.debug(
                {
                    args: [
                        account.address!,
                        BigInt(proof!.merkle_root),
                        BigInt(proof!.nullifier_hash),
                        decodeAbiParameters(
                            parseAbiParameters('uint256[8]'),
                            proof!.proof as `0x${string}`
                        )[0],
                    ],
                }
            )
            await writeContractAsync({
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                account: account.address!,
                abi,
                functionName: 'verifyPublicAddress',
                args: [
                    account.address!,
                    BigInt(proof!.merkle_root),
                    BigInt(proof!.nullifier_hash),
                    decodeAbiParameters(
                        parseAbiParameters('uint256[8]'),
                        proof!.proof as `0x${string}`
                    )[0],
                ],
            })
            console.debug('Proof verified')
            result.refetch()
        } catch (error) { throw new Error((error as BaseError).shortMessage) }
    }

    const onSuccess = () => {
        console.log("Success")
    };

    return (
        <DashboardContext.Provider value={depth}>

            <div className="min-h-screen w-full relative">
                <div className=" flex flex-row-reverse justify-between items-center absolute top-5 px-5 w-full">
                    {
                        account.isConnected ?

                            <Dropdown
                                shouldCloseOnInteractOutside={(e) => false}
                                closeOnSelect={false}
                            >
                                <div
                                    className=" gap-2  flex justify-center items-center"
                                >
                                    {
                                        result.data ? <img src="https://cryptologos.cc/logos/worldcoin-org-wld-logo.png"
                                            className="w-8 h-8"
                                        /> :
                                            <IDKitWidget
                                                app_id="app_staging_4989e6a8b385ae6116fb36aeae08c250"
                                                action="verify-public-address"
                                                verification_level={VerificationLevel.Orb}
                                                onSuccess={verifyProof}
                                                signal={account.address}

                                            >
                                                {({ open }) => (

                                                    <img onClick={open} src="https://cryptologos.cc/logos/worldcoin-org-wld-logo.png"
                                                        className="w-8 h-8 opacity-50 cursor-pointer"
                                                    />

                                                )}
                                            </IDKitWidget>
                                    }
                                    <DropdownTrigger>
                                        <Button className="p-0">
                                            <Identity
                                                className="bg-none px-2 py-1"
                                                address={account.address}
                                                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                                            >
                                                <Avatar className="mr-2" />
                                                <Name />
                                                <Address />
                                            </Identity>
                                        </Button>
                                    </DropdownTrigger>
                                </div>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new">Inbox</DropdownItem>
                                    <DropdownItem key="copy">
                                        <Popover
                                            offset={30}
                                            placement="right">
                                            <PopoverTrigger>
                                                <p>Settings</p>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div className="px-1 py-2">
                                                    <div className="text-small font-bold">Select the max user tier able to send DMs to you.</div>
                                                    <Slider
                                                        size="md"
                                                        step={1}
                                                        color="foreground"
                                                        label="Length"
                                                        showSteps={true}
                                                        maxValue={10}
                                                        minValue={1}
                                                        defaultValue={3}
                                                        className="max-w-md"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </DropdownItem>
                                    <DropdownItem key="copy">
                                        <Popover
                                            offset={30}
                                            placement="right">
                                            <PopoverTrigger>
                                                <p>Graph Length</p>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div className="px-1 py-2">
                                                    <div className="text-small font-bold">Select the max graph tier visible</div>
                                                    <Slider
                                                        onChange={(value) => setDepth(value as number)}
                                                        size="md"
                                                        step={1}
                                                        color="foreground"
                                                        label="Length"
                                                        showSteps={true}
                                                        maxValue={10}
                                                        minValue={1}
                                                        defaultValue={3}
                                                        className="max-w-md"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </DropdownItem>
                                    <DropdownItem key="disconnect">
                                        <Button size="sm" variant="solid" onClick={async () => {
                                            await handleLogOut()
                                            router.replace('/')
                                        }} fullWidth color="danger">
                                            Disconect
                                        </Button>
                                    </DropdownItem>

                                </DropdownMenu>
                            </Dropdown>
                            : <DynamicConnectButton>
                                <div className="px-4 py-2  bg-default rounded-md">
                                    Log-In
                                </div>
                            </DynamicConnectButton>
                    }

                    <div className="w-1/2 hidden md:block">

                        <Input
                            label="Search"
                            isClearable
                            radius="lg"
                            classNames={{
                                label: "text-black/50 dark:text-white/90",
                                input: [
                                    "bg-transparent",
                                    "text-black/90 dark:text-white/90",
                                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                ],
                                innerWrapper: "bg-transparent",
                                inputWrapper: [
                                    "shadow-xl",
                                    "bg-default-200/50",
                                    "dark:bg-default/60",
                                    "backdrop-blur-xl",
                                    "backdrop-saturate-200",
                                    "hover:bg-default-200/70",
                                    "dark:hover:bg-default/70",
                                    "group-data-[focus=true]:bg-default-200/50",
                                    "dark:group-data-[focus=true]:bg-default/60",
                                    "!cursor-text",
                                ],
                            }}
                            placeholder="Type to search..."
                            startContent={
                                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                            }

                        />
                    </div>
                </div>

                {children}

                <div className="md:hidden w-full absolute bottom-5 px-5">
                    <Input
                        label="Search"
                        isClearable
                        radius="lg"
                        classNames={{
                            label: "text-black/50 dark:text-white/90",
                            input: [
                                "bg-transparent",
                                "text-black/90 dark:text-white/90",
                                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                            ],
                            innerWrapper: "bg-transparent",
                            inputWrapper: [
                                "shadow-xl",
                                "bg-default-200/50",
                                "dark:bg-default/60",
                                "backdrop-blur-xl",
                                "backdrop-saturate-200",
                                "hover:bg-default-200/70",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=true]:bg-default-200/50",
                                "dark:group-data-[focus=true]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                        placeholder="Type to search..."
                        startContent={
                            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        }

                    />
                </div>
            </div>
        </DashboardContext.Provider>

    );
}
