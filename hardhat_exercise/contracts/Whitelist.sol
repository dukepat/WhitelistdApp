//SPDX-Licence-Identifier:MIT
pragma solidity ^0.8.0;

contract Whitelist {

    unit8 public maxWhitelistedAddresses;
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxwhitelistedAddresses;
        
    }
}