import {ethers} from "hardhat";

export async function deployBookLibrary() {
    const BookLibraryFactory = await ethers.getContractFactory("BookLibrary");
    const bookLibrary = await BookLibraryFactory.deploy();
    await bookLibrary.waitForDeployment();

    const tx = await bookLibrary.deploymentTransaction();
    console.log(`The BookLibrary contract is deployed to ${bookLibrary.target}`);
    console.log(`Owner=${tx?.from}, transaction hash: ${tx?.hash}`)
    return tx;
}


