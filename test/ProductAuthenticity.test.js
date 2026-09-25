import { expect } from "chai";
import hre from "hardhat";

describe("ProductAuthenticity", function () {
  let ProductAuthenticity;
  let productAuthenticity;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    
    ProductAuthenticity = await hre.ethers.getContractFactory("ProductAuthenticity");
    productAuthenticity = await ProductAuthenticity.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await productAuthenticity.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new product successfully", async function () {
      await expect(
        productAuthenticity.mintProduct(addr1.address, "SN-12345", "BATCH-A", "ipfs://metadata-uri")
      )
        .to.emit(productAuthenticity, "Transfer")
        .withArgs(hre.ethers.ZeroAddress, addr1.address, 0n);

      expect(await productAuthenticity.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should revert if non-owner tries to mint", async function () {
      await expect(
        productAuthenticity.connect(addr1).mintProduct(addr2.address, "SN-12345", "BATCH-A", "ipfs://metadata")
      ).to.be.revertedWithCustomError(productAuthenticity, "OwnableUnauthorizedAccount");
    });

    it("Should reject duplicate serial numbers", async function () {
      await productAuthenticity.mintProduct(addr1.address, "SN-12345", "BATCH-A", "ipfs://metadata-uri");
      
      await expect(
        productAuthenticity.mintProduct(addr2.address, "SN-12345", "BATCH-B", "ipfs://metadata-uri-2")
      ).to.be.revertedWith("Serial number already registered");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await productAuthenticity.mintProduct(addr1.address, "SN-999", "BATCH-XYZ", "ipfs://demo");
    });

    it("Should verify existing token correctly", async function () {
      const [tokenOwner, serialNumber, batchId, manufactureDate, metadataURI] = await productAuthenticity.verifyProduct(0);
      
      expect(tokenOwner).to.equal(addr1.address);
      expect(serialNumber).to.equal("SN-999");
      expect(batchId).to.equal("BATCH-XYZ");
      expect(manufactureDate).to.be.above(0n);
      expect(metadataURI).to.equal("ipfs://demo");
    });

    it("Should revert verification of non-existent token", async function () {
      await expect(
        productAuthenticity.verifyProduct(1)
      ).to.be.revertedWithCustomError(productAuthenticity, "ERC721NonexistentToken");
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await productAuthenticity.mintProduct(owner.address, "SN-100", "BATCH-1", "ipfs://transfer-test");
    });

    it("Should transfer ownership correctly", async function () {
      // Owner transfers to addr1
      await productAuthenticity.transferFrom(owner.address, addr1.address, 0);
      
      expect(await productAuthenticity.ownerOf(0)).to.equal(addr1.address);
      
      const [newOwner] = await productAuthenticity.verifyProduct(0);
      expect(newOwner).to.equal(addr1.address);
    });
  });
});
