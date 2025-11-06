const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error(
      "No signers found. Please set PRIVATE_KEY in your .env file.\n" +
      "Example: PRIVATE_KEY=your_private_key_here"
    );
  }

  const [deployer] = signers;
  console.log("Deploying ProofOfArt contract with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Account has no balance. Please fund your account with testnet ETH.");
  }

  console.log("Deploying ProofOfArt contract...");
  const ProofOfArt = await hre.ethers.getContractFactory("ProofOfArt", deployer);
  const proofOfArt = await ProofOfArt.deploy();

  await proofOfArt.waitForDeployment();
  const contractAddress = await proofOfArt.getAddress();
  
  console.log("\n✅ Contract deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("\n📝 Add this to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n🔗 View on explorer:");
  const network = await hre.ethers.provider.getNetwork();
  if (network.chainId === 11155111n) {
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (network.chainId === 80001n) {
    console.log(`https://mumbai.polygonscan.com/address/${contractAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
