// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityPoints is ERC20, Ownable {
    constructor(
    ) ERC20("IdentityPoints", "PPL") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        revert("Transfers are disabled for this token");
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        revert("Transfers are disabled for this token");
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        revert("Transfers are disabled for this token");
    }
}
