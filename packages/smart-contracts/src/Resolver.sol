// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SchemaResolver} from "eas-contracts/resolver/SchemaResolver.sol";
import {IEAS, Attestation} from "eas-contracts/IEAS.sol";
import {ConnectionManager} from "./ConnectionsManager.sol";

contract Resolver is SchemaResolver {
    ConnectionManager private _connectionManager;
    constructor(IEAS eas, ConnectionManager manager)  SchemaResolver(eas) {
        _connectionManager = manager;
    }

    function onAttest(
        Attestation calldata attestation,
        uint256 /*value*/
    ) internal override returns (bool) {
        (address connector, address recipient) = abi.decode(attestation.data, (address, address));
        _connectionManager.connect(connector, recipient);
        return true;
    }

    function onRevoke(
        Attestation calldata,
        /*attestation*/ uint256 /*value*/
    ) internal pure override returns (bool) {
        return true;
    }
}
