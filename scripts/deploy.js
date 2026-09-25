import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying ProductAuthenticity contract...");

  const ProductAuthenticity = await hre.ethers.getContractFactory("ProductAuthenticity");
  const productAuthenticity = await ProductAuthenticity.deploy();

  await productAuthenticity.waitForDeployment();
  const address = await productAuthenticity.getAddress();

  console.log(`ProductAuthenticity deployed to: ${address}`);

  // Create frontend/src directory if it doesn't exist
  const frontendSrcDir = path.join(__dirname, "..", "frontend", "src");
  if (!fs.existsSync(frontendSrcDir)) {
    fs.mkdirSync(frontendSrcDir, { recursive: true });
  }

  // Export contract address and ABI to frontend
  const artifact = await hre.artifacts.readArtifact("ProductAuthenticity");
  const contractData = {
    address: address,
    abi: artifact.abi
  };

  fs.writeFileSync(
    path.join(frontendSrcDir, "contractData.json"),
    JSON.stringify(contractData, null, 2)
  );
  
  console.log("Contract address and ABI exported to frontend/src/contractData.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
