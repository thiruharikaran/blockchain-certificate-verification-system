// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateVerification {
    address public owner;

    mapping(string => bool) private certificates;

    event CertificateAdded(string hash, address addedBy);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function addCertificate(string memory hash) public onlyOwner {
        certificates[hash] = true;
        emit CertificateAdded(hash, msg.sender);
    }

    function verifyCertificate(string memory hash) public view returns (bool) {
        return certificates[hash];
    }
}
