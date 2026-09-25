import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MintPage from './pages/MintPage';
import VerificationPage from './pages/VerificationPage';
import TransferPage from './pages/TransferPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>Product Verification dApp</h2>
          <div className="nav-links">
            <Link to="/">Verify Product</Link>
            <Link to="/mint">Manufacturer (Mint)</Link>
            <Link to="/transfer">Transfer Ownership</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<VerificationPage />} />
            <Route path="/mint" element={<MintPage />} />
            <Route path="/transfer" element={<TransferPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
