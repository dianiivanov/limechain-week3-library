import {ethers, run, network} from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

export async function deployBookLibrary() {
    const BookLibraryFactory = await ethers.getContractFactory("BookLibrary");
    const bookLibrary = await BookLibraryFactory.deploy();
    await bookLibrary.waitForDeployment();
    // const bookLibrary = await ethers.deployContract("BookLibrary");

    const tx = await bookLibrary.deploymentTransaction();
    console.log(`The BookLibrary contract is deployed to ${bookLibrary.target}`);
    console.log(`Owner=${tx.from}, transaction hash: ${tx.hash}`)
    
    if(network.config.url !== config.networks.localhost.url) {
        const owner = await bookLibrary.owner();
        await tx?.wait(5);
        try {
            await run("verify:verify", {
                address: bookLibrary.target,
                constructorArguments: [],
            });
            console.log("Verified");
        } catch (e: any) {
            if(e.message.toLowerCase().includes("already verified")) {
                console.log("Already verified!");
            } else {
                console.log(e);
            }
        }
    }
}