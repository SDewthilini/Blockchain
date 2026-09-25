import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Html5QrcodeScanner } from 'html5-qrcode';
import contractData from '../contractData.json';
import './VerificationPage.css';

export default function VerificationPage() {
  const [tokenId, setTokenId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    // Setup QR scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    
    scanner.render(onScanSuccess, onScanFailure);
    
    function onScanSuccess(decodedText) {
      try {
        const data = JSON.parse(decodedText);
        if (data.tokenId) {
          setTokenId(data.tokenId);
          verifyProduct(data.tokenId);
          scanner.clear(); // stop scanning once found
        }
      } catch(e) {
        // Not JSON or missing tokenId
      }
    }
    
    function onScanFailure(error) {
      // Ignore routine scan failures
    }

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, []);

  const verifyProduct = async (idToVerify) => {
    try {
      setStatus("Verifying...");
      setVerificationResult(null);
      
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = new ethers.Contract(
        contractData.address,
        contractData.abi,
        provider
      );
      
      const result = await contract.verifyProduct(idToVerify);
      
      setVerificationResult({
        genuine: true,
        owner: result[0],
        serialNumber: result[1],
        batchId: result[2],
        manufactureDate: new Date(Number(result[3]) * 1000).toLocaleString(),
        metadataURI: result[4]
      });
      setStatus('');
      
    } catch (error) {
      console.error(error);
      setVerificationResult({ genuine: false });
      setStatus('');
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (tokenId) {
      verifyProduct(tokenId);
    }
  };

  return (
    <div className="page-container">
      <h2>Verify Product Authenticity</h2>
      <p>Scan the product QR code or enter the Token ID manually.</p>
      
      <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
      
      <div className="manual-entry">
        <h3>Manual Entry</h3>
        <form onSubmit={handleManualVerify} className="form-group flex-row">
          <input 
            type="number"
            placeholder="Enter Token ID" 
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </div>

      {status && <div className="status-message">{status}</div>}

      {verificationResult && (
        <div className={`result-card ${verificationResult.genuine ? 'genuine' : 'fake'}`}>
          {verificationResult.genuine ? (
            <>
              <h3>✅ Genuine Product</h3>
              <p><strong>Owner:</strong> {verificationResult.owner}</p>
              <p><strong>Serial Number:</strong> {verificationResult.serialNumber}</p>
              <p><strong>Batch ID:</strong> {verificationResult.batchId}</p>
              <p><strong>Manufacture Date:</strong> {verificationResult.manufactureDate}</p>
              <p><strong>Metadata URI:</strong> {verificationResult.metadataURI}</p>
            </>
          ) : (
            <>
              <h3>❌ Not Registered / Possible Counterfeit</h3>
              <p>This token ID could not be found on the blockchain.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
