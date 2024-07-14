// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityPoints is ERC20, Ownable {
    constructor() ERC20("IdentityPoints", "PPL") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
    function transfer(
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        recipient;
        amount;
        revert("TRANSFER_NOT_SUPPORTED");
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        sender;
        recipient;
        amount;
        revert("TRANSFER_NOT_SUPPORTED");
    }
}
