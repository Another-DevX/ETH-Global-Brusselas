// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ConnectionManager} from "../src/ConnectionsManager.sol";
import {IWorldID} from "../src/interfaces/IWorldID.sol";
import {Resolver} from "../src/Resolver.sol";
import {IEAS} from "eas-contracts/IEAS.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();
        ConnectionManager cm = new ConnectionManager(
            IWorldID(0x42FF98C4E85212a5D31358ACbFe76a621b50fC02),
            "app_staging_4989e6a8b385ae6116fb36aeae08c250",
            "verify-public-address"
        );
        Resolver resolver = new Resolver(
            IEAS(0x4200000000000000000000000000000000000021),
            cm
        );
        vm.stopBroadcast();
        console.log(
            "ConnectionManager deployed at: ",
            address(cm),
            "Resolver deployed at: ",
            address(resolver)
        );
    }
}
