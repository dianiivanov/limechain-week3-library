# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

# Contracts deployed to sepolia/goerli testnets
```C:\Dido\web3\LimeChain\limechain-week3-library>npx hardhat deploy --network sepolia
The BookLibrary contract is deployed to 0xC97f3FD0A81432EaefF25DcCd8F32180E0437fcB
Owner=0x1834F41030aBA75221A45ea7BBd8a8e404D202E9, transaction hash: 0x3f0da278baa7bc30dff45175f0c13f22cce8d1f3f1da7a8afd0c7adc2e259c7e
The contract 0xC97f3FD0A81432EaefF25DcCd8F32180E0437fcB has already been verified.
https://sepolia.etherscan.io/address/0xC97f3FD0A81432EaefF25DcCd8F32180E0437fcB#code
Verified

C:\Dido\web3\LimeChain\limechain-week3-library>npx hardhat deploy --network goerli
The BookLibrary contract is deployed to 0xDD7E44A7E8F5DD1bbA2a9A240732fa2fb51C5598
Owner=0x1834F41030aBA75221A45ea7BBd8a8e404D202E9, transaction hash: 0x519ec8d40f09edb9a96590d13de2e63353c49d7fbc2c7df9b3ccfede398b14d0
The contract 0xDD7E44A7E8F5DD1bbA2a9A240732fa2fb51C5598 has already been verified.
https://goerli.etherscan.io/address/0xDD7E44A7E8F5DD1bbA2a9A240732fa2fb51C5598#code
Verified```

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
