require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env file
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const API_URL = process.env.API_URL;
// Ensure the environment variables are loaded
if (!API_KEY || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error(
    "Please set your API_KEY, PRIVATE_KEY, and CONTRACT_ADDRESS in a .env file"
  );
  process.exit(1);
}
//for hardhat

const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");
console.log("contract", contract.abi);

// // Path to the contract artifact
// const contractPath = path.join(
//   __dirname,
//   "../artifacts/contracts/HelloWorld.sol/HelloWorld.json"
// );

// Ensure the contract artifact file exists
// if (!fs.existsSync(contractPath)) {
//   console.error("Contract artifact not found at path:", contractPath);
//   process.exit(1);
// }

// // Load the contract artifact
// const contractABI = require(contractPath);

// Define network configuration for Sepolia or use a supported network
const network = {
  name: "Sepolia",
  chainId: 11155111,
  url: `https://eth-sepolia.g.alchemy.com/v2/2On3k53eTnK8-EIdmj5XD75WoLWcNa6h`,
};

// Create a provider
const provider = new ethers.providers.JsonRpcProvider(API_URL);

// Create a signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Create a contract instance
const helloWorldContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contract.abi,
  signer
);

// Log the contract's ABI
console.log(JSON.stringify(contract.abi));

async function main() {
  try {
    const message = await helloWorldContract.message();
    console.log("The message is: " + message);
    console.log("Updating the message...");
    const tx = await helloWorldContract.update("This is the new message.");
    await tx.wait();
    const newMessage = await helloWorldContract.message();
    console.log("The new message is: " + newMessage);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
