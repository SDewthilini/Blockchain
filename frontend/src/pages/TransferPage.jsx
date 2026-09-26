import { useState } from 'react';
import { ethers } from 'ethers';
import contractData from '../contractData.json';

// Default to Hardhat Account #0
const DEFAULT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export default function TransferPage() {
  const [formData, setFormData] = useState({
    tokenId: '',
    newOwner: '',
    privateKey: DEFAULT_PRIVATE_KEY
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    try {
      setStatus("Initializing built-in wallet...");
      
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = new ethers.Wallet(formData.privateKey, provider);
      const currentAddress = await signer.getAddress();
      
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        signer
      );

      setStatus(`Submitting transaction from ${currentAddress.substring(0, 8)}...`);
      
      const tx = await contract.transferFrom(
        currentAddress,
        formData.newOwner,
        formData.tokenId
      );
      
      setStatus("Transaction submitted, waiting for receipt...");
      await tx.wait();
      
      setStatus("Transfer successful!");
      setFormData({ ...formData, tokenId: '', newOwner: '' });
      
    } catch (error) {
      console.error(error);
      setStatus("Error: " + (error.reason || error.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Transfer Ownership</h2>
      <p>Transfer product ownership to a new wallet address (e.g., when selling).</p>
      
      <div style={{ padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem' }}>
        <strong>Demo Mode:</strong> Enter the current owner's private key to sign the transfer transaction (No MetaMask required).
      </div>
      
      <form onSubmit={handleTransfer} className="form-card">
        <div className="form-group">
          <label>Current Owner's Private Key</label>
          <input 
            type="password"
            name="privateKey" 
            value={formData.privateKey} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Token ID to Transfer</label>
          <input 
            type="number"
            name="tokenId" 
            value={formData.tokenId} 
            onChange={handleChange} 
            placeholder="e.g. 0"
            required 
          />
        </div>
        <div className="form-group">
          <label>New Owner Address</label>
          <input 
            name="newOwner" 
            value={formData.newOwner} 
            onChange={handleChange} 
            placeholder="e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            required 
          />
        </div>
        <button type="submit">Transfer NFT</button>
      </form>
      
      {status && <div className="status-message">{status}</div>}
    </div>
  );
}
