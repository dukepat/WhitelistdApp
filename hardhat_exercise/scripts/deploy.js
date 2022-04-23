const { ethers } = require("hardhat")


async function main() {

    const whitelistContract = await ethers.getContractFactory("Whitelist");
    const deployedWhitelistedContract = await whitelistContract.deploy(10);
    await deployedWhitelistedContract.deployed();

    console.log("Whitelist Contract Address", deployedWhitelistedContract.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });