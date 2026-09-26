import { useState } from 'react';
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import contractData from '../contractData.json';

// Hardhat Account #0 (The deployer/manufacturer)
const MANUFACTURER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export default function MintPage() {
  const [formData, setFormData] = useState({
    serialNumber: '',
    batchId: '',
    metadataURI: ''
  });
  const [status, setStatus] = useState('');
  const [mintedInfo, setMintedInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleMint = async (e) => {
    e.preventDefault();
    
    try {
      setStatus("Initializing built-in manufacturer wallet...");
      
      // Connect directly to local Hardhat node
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      // Use the hardcoded private key instead of MetaMask
      const signer = new ethers.Wallet(MANUFACTURER_PRIVATE_KEY, provider);
      
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        signer
      );

      setStatus("Submitting transaction to the blockchain...");
      const address = await signer.getAddress();
      
      const tx = await contract.mintProduct(
        address, 
        formData.serialNumber, 
        formData.batchId, 
        formData.metadataURI
      );
      
      setStatus("Transaction submitted, waiting for receipt...");
      const receipt = await tx.wait();
      
      // Get the emitted token ID from Transfer event
      const transferEvent = receipt.logs.find(
        (log) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'Transfer';
          } catch (e) {
            return false;
          }
        }
      );
      
      let tokenId = "0";
      if (transferEvent) {
         const parsed = contract.interface.parseLog(transferEvent);
         tokenId = parsed.args[2].toString();
      }
      
      setMintedInfo({
        tokenId: tokenId,
        contractAddress: contractData.address
      });
      
      setStatus("Successfully minted!");
    } catch (error) {
      console.error(error);
      setStatus("Error: " + (error.reason || error.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Manufacturer Dashboard</h2>
      <p>Mint a new physical product on the blockchain to verify its authenticity.</p>
      
      <div style={{ padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem' }}>
        <strong>Demo Mode:</strong> Using built-in Manufacturer Wallet (No MetaMask required).
      </div>
      
      <form onSubmit={handleMint} className="form-card">
        <div className="form-group">
          <label>Serial Number (Physical)</label>
          <input 
            name="serialNumber" 
            value={formData.serialNumber} 
            onChange={handleChange} 
            placeholder="e.g. SN-XYZ-123"
            required 
          />
        </div>
        <div className="form-group">
          <label>Batch ID</label>
          <input 
            name="batchId" 
            value={formData.batchId} 
            onChange={handleChange} 
            placeholder="e.g. BATCH-2023-A"
            required 
          />
        </div>
        <div className="form-group">
          <label>Product Metadata URI (IPFS/URL)</label>
          <input 
            name="metadataURI" 
            value={formData.metadataURI} 
            onChange={handleChange} 
            placeholder="e.g. ipfs://..."
            required 
          />
        </div>
        <button type="submit">Mint Product NFT</button>
      </form>
      
      {status && <div className="status-message">{status}</div>}
      
      {mintedInfo && (
        <div className="qr-container">
          <h3>Product Registered!</h3>
          <p>Token ID: {mintedInfo.tokenId}</p>
          <div className="qr-code-wrapper">
            <QRCodeSVG 
              value={JSON.stringify(mintedInfo)} 
              size={200}
            />
          </div>
          <p className="small-text">Print this QR code and attach it to the product.</p>
        </div>
      )}
    </div>
  );
}
