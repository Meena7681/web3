const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  //compile them in our code
  // compile them separately
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  // const privatePass = process.env.PRIVATE_KEY_PASSWORD;
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   privatePass
  // );
  // wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  console.log(`Contract Address: ${contract.address}`);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite Number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// async function main() {
//   try {
//     // Connect to the local Ethereum blockchain
//     const provider = new ethers.providers.JsonRpcProvider(
//       "http://127.0.0.1:7545"
//     );

//     // Replace the private key below with your actual Ethereum account private key
//     const privateKey =
//       "0xe980dcddbd1be9cd6a0070a669491b9ad41bb676f15fbb9b2df66e06877d4a96";
//     const wallet = new ethers.Wallet(privateKey, provider);

//     // Load contract ABI and bytecode
//     const abiFilePath = path.join(
//       __dirname,
//       "SimpleStorage_sol_SimpleStorage.abi"
//     );
//     const abi = JSON.parse(fs.readFileSync(abiFilePath, "utf8"));

//     const bytecodeFilePath = path.join(
//       __dirname,
//       "SimpleStorage_sol_SimpleStorage.bin"
//     );
//     const bytecode = "0x" + fs.readFileSync(bytecodeFilePath, "utf8");

//     // Create a contract factory
//     const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);

//     console.log("Deploying, please wait...");
//     // Deploy the contract
//     const contract = await contractFactory.deploy();

//     // Wait for the contract to be mined and get the deployed address
//     await contract.deployed();
//     console.log("Contract deployed to address:", contract.address);
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
