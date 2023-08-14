# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

```
C:\Dido\web3\LimeChain\limechain-week3-library>npx hardhat deploy --network sepolia
The BookLibrary contract is deployed to 0x7174CB4ad461e115293508aD1c41c6F1D400Fde8


C:\Dido\web3\LimeChain\limechain-week3-library>npx hardhat deploy --network goerli
The BookLibrary contract is deployed to 0x0adcbe0F10b725B2cd0d1E3D71F30DEe7C0d45Bb

interacting with localhost:
node interact-with-local.js <contract address>

interacting with sepolia:
node interact-with-network.js sepolia <contract address>

interacting with goerli:
node interact-with-network.js goerli <contract address>

Try running some of the following tasks:

npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

