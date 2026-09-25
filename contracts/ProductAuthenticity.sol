// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProductAuthenticity
 * @dev This contract manages the minting and verification of physical products
 *      using NFTs to prevent counterfeiting.
 */
contract ProductAuthenticity is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Struct to store product information
    struct ProductDetails {
        string serialNumber;
        string batchId;
        uint256 manufactureDate;
        string metadataURI;
    }

    // Mapping from token ID to ProductDetails
    mapping(uint256 => ProductDetails) private _productDetails;

    // Mapping to track if a serial number has already been registered
    mapping(string => bool) private _registeredSerialNumbers;

    /**
     * @dev Constructor sets the token name and symbol, and the deployer as the initial owner.
     */
    constructor() ERC721("AuthenticProduct", "AUTH") Ownable(msg.sender) {}

    /**
     * @dev Mints a new product NFT. Only callable by the manufacturer (owner).
     * @param to The address to receive the NFT (could be the manufacturer or directly the retailer).
     * @param serialNumber The unique physical serial number of the product.
     * @param batchId The manufacturing batch ID.
     * @param metadataURI Off-chain metadata URI (e.g. IPFS link to product specs).
     */
    function mintProduct(
        address to,
        string memory serialNumber,
        string memory batchId,
        string memory metadataURI
    ) public onlyOwner {
        require(!_registeredSerialNumbers[serialNumber], "Serial number already registered");

        uint256 tokenId = _nextTokenId++;
        
        _registeredSerialNumbers[serialNumber] = true;
        
        _productDetails[tokenId] = ProductDetails({
            serialNumber: serialNumber,
            batchId: batchId,
            manufactureDate: block.timestamp,
            metadataURI: metadataURI
        });

        _mint(to, tokenId);
    }

    /**
     * @dev Verifies a product by returning its details and current owner.
     * @param tokenId The ID of the NFT to verify.
     * @return owner Address of the current owner.
     * @return serialNumber The physical serial number.
     * @return batchId The manufacturing batch ID.
     * @return manufactureDate The timestamp of manufacturing.
     * @return metadataURI The metadata URI.
     */
    function verifyProduct(uint256 tokenId)
        public
        view
        returns (
            address owner,
            string memory serialNumber,
            string memory batchId,
            uint256 manufactureDate,
            string memory metadataURI
        )
    {
        // Reverts if token doesn't exist
        owner = ownerOf(tokenId);
        
        ProductDetails memory details = _productDetails[tokenId];
        return (
            owner,
            details.serialNumber,
            details.batchId,
            details.manufactureDate,
            details.metadataURI
        );
    }
}
