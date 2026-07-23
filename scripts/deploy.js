const hre = require("hardhat");

async function main() {

    console.log("Deploying Crowdfunding Contract...");

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");

    const crowdfunding = await Crowdfunding.deploy();

    await crowdfunding.waitForDeployment();

    console.log("--------------------------------------");
    console.log("Contract Successfully Deployed");
    console.log("--------------------------------------");

    console.log("Contract Address:");

    console.log(await crowdfunding.getAddress());

}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;

});