// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SchemaResolver} from "eas-contracts/resolver/SchemaResolver.sol";
import {IEAS, Attestation} from "eas-contracts/IEAS.sol";
import {ConnectionManager} from "./ConnectionsManager.sol";

contract Resolver is SchemaResolver {
    address private _connectionManager;
    constructor(IEAS eas, ConnectionManager manager) Ownable(msg.sender) SchemaResolver(eas) {
        _connectionManager = address(manager);
    }

    function onAttest(
        Attestation calldata attestation,
        uint256 /*value*/
    ) internal override returns (bool) {
        (address connector, address recipient) = abi.decode(attestation.data, (address, address));
        _connectionManager.connect(connector, recipent);
        return true;
    }

    function onRevoke(
        Attestation calldata,
        /*attestation*/ uint256 /*value*/
    ) internal pure override returns (bool) {
        return true;
    }
}
