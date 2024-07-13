
'use client'
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import abi from '@/constants/ConnectionManager.abi.json'
import { useRouter } from "next/navigation";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { BaseError, decodeAbiParameters, parseAbiParameters } from "viem";
import { SearchIcon } from "@/components/SearchIcon";
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { address } = useAccount()

    const result = useReadContract({
        abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        functionName: '_isVerified',
        args: [address!]
    })

    const { writeContractAsync } = useWriteContract()
    const account = useAccount()
    const router = useRouter()


    const verifyProof = async (proof: ISuccessResult) => {
        try {
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
        } catch (error) { throw new Error((error as BaseError).shortMessage) }
    }

    const onSuccess = () => {
        console.log("Success")
    };

    return (
        <div className="min-h-screen w-full relative">
            <div className=" flex flex-row-reverse justify-between items-center absolute top-5 px-5 w-full">

                <Dropdown >
                    <div
                        className=" gap-2  flex justify-center items-center"
                    >
                        {
                            result && <img src="https://cryptologos.cc/logos/worldcoin-org-wld-logo.png"
                                className="w-8 h-8"
                            />
                        }
                        <DropdownTrigger>

                            <Button
                                variant="bordered"
                            >
                                anotherdev.eth
                            </Button>
                        </DropdownTrigger>
                    </div>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="new">Inbox</DropdownItem>
                        <DropdownItem key="copy">Graph Length</DropdownItem>
                        <DropdownItem key="copy">Settings</DropdownItem>

                        {/* @ts-expect-error bad nextui implementation */}
                        {!result &&
                            <DropdownItem key="verified">
                                <IDKitWidget
                                    app_id="app_staging_4989e6a8b385ae6116fb36aeae08c250"
                                    action="verify-public-address"
                                    verification_level={VerificationLevel.Orb}
                                    onSuccess={verifyProof}
                                    signal={account.address}
                                >
                                    {({ open }) => (
                                        <Button className="flex gap-2" onClick={open} variant="bordered">
                                            <img src="https://cryptologos.cc/logos/worldcoin-org-wld-logo.png"
                                                className="w-4 h-4"
                                            />
                                            Verify with worldcoin</Button>
                                    )}
                                </IDKitWidget>
                            </DropdownItem>
                        }
                        <DropdownItem key="disconnect">
                            <Button size="sm" variant="solid" fullWidth color="danger">
                                Disconect
                            </Button>
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>
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

    );
}
