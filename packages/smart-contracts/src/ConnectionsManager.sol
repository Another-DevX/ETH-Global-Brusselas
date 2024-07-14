// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IdentityPoints} from "./IdentityPoints.sol";

contract ConnectionManager {

    event Connection(address indexed connector, address indexed recipient);
    event Verification(address indexed signal);

    mapping(address => bool) public _isVerified;
    mapping(address => mapping(address => bool)) public connections;
    mapping(address => uint256) public boosts;

    /// @dev This allows us to use our hashToField function on bytes
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The address of the World ID Router contract that will be used for verifying proofs
    IWorldID internal immutable worldId;


    /// @dev The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal immutable externalNullifierHash;

    /// @dev The World ID group ID (1 for Orb-verified)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @dev The unstranferable token used to incentivize users to connect
    IdentityPoints internal immutable identityPoints;


    /// @param _worldId The address of the WorldIDRouter that will verify the proofs
    /// @param _appId The World ID App ID (from Developer Portal)
    /// @param _action The World ID Action (from Developer Portal)
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _action,
        IdentityPoints _identityPoints
    ) {
        worldId = _worldId;
        externalNullifierHash = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _action)
            .hashToField();
        identityPoints = _identityPoints;
    }

    function verifyPublicAddress(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        worldId.verifyProof(
            root,
            groupId, // set to "1" in the constructor
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        nullifierHashes[nullifierHash] = true;

        _isVerified[signal] = true;
        emit Verification(signal);
    }

    function connect(address connector, address recipient) public {
        require(!connections[connector][recipient] && !connections[recipient][connector], "The users are connected yet");
        connections[connector][recipient] = true;
        if(_isVerified[connector] && _isVerified[recipient]) {
            boost(connector, recipient);
        }
        emit Connection(connector, recipient);
    }

    function boost(address connector, address recipient) internal {
        identityPoints.mint(recipient, 1e18 * boosts[connector]);
        boosts[connector] += 1;
    }
}
