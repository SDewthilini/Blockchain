import { useState } from 'react';
import { ethers } from 'ethers';
import contractData from '../contractData.json';
import './TransferPage.css';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    tokenId: '',
    newOwner: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }
    
    try {
      setStatus("Connecting to wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const currentAddress = await signer.getAddress();
      
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        signer
      );

      setStatus("Waiting for transaction confirmation...");
      
      const tx = await contract.transferFrom(
        currentAddress,
        formData.newOwner,
        formData.tokenId
      );
      
      setStatus("Transaction submitted, waiting for receipt...");
      await tx.wait();
      
      setStatus("Transfer successful!");
      setFormData({ tokenId: '', newOwner: '' });
      
    } catch (error) {
      console.error(error);
      setStatus("Error: " + (error.reason || error.message));
    }
  };

  return (
    <div className="page-container">
      <h2>Transfer Ownership</h2>
      <p>Transfer product ownership to a new wallet address (e.g., when selling).</p>
      
      <form onSubmit={handleTransfer} className="form-card">
        <div className="form-group">
          <label>Token ID</label>
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
            placeholder="e.g. 0x123..."
            required 
          />
        </div>
        <button type="submit">Transfer NFT</button>
      </form>
      
      {status && <div className="status-message">{status}</div>}
    </div>
  );
}
