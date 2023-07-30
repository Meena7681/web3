const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage",
    );
    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    // const contract = await ethers.deployContract("SimpleStorage");
    const address = await simpleStorage.getAddress();
    console.log("Contract address:", address);
    // what happens when we deploy to our hardhat network?
    // 4 == 4  -> true
    // 4 == "4"  -> true
    // 4 === "4"  -->false
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block txes.....");
        await simpleStorage.deploymentTransaction().wait(6);
        console.log(address);
        await verify(address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);
    //Update the current value
    const transactionResponse = await simpleStorage.store(50);
    await transactionResponse.wait(1);
    const updateValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${updateValue}`);
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract....");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArgument: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
