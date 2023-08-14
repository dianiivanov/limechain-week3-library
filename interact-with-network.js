const { ethers } = require("ethers");
const BookLibrary = require("./artifacts/contracts/BookLibrary.sol/BookLibrary.json");
require("dotenv").config();
const libraryUtils = require("./libraryUtils");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BOOK_TO_USE = "Book1";

const run = async function (network, libraryContractAddress) {
  const provider = new ethers.InfuraProvider(network, INFURA_API_KEY);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const libraryContract = new ethers.Contract(
    libraryContractAddress,
    BookLibrary.abi,
    wallet
  );

  console.log(`Creating ${BOOK_TO_USE}...`);
  await libraryUtils.createBook(libraryContract, BOOK_TO_USE, 10);
  await libraryUtils.logIfBorrowedAndBookCopies(libraryContract, BOOK_TO_USE);
  console.log(
    "Books in the library:",
    await libraryUtils.checkAllBooks(libraryContract)
  );

  console.log(`Renting ${BOOK_TO_USE}...`);
  await libraryUtils.rentABook(libraryContract, BOOK_TO_USE);
  await libraryUtils.logIfBorrowedAndBookCopies(libraryContract, BOOK_TO_USE);

  console.log(`Returning  ${BOOK_TO_USE}...`);
  await libraryUtils.returnABook(libraryContract, BOOK_TO_USE);
  await libraryUtils.logIfBorrowedAndBookCopies(libraryContract, BOOK_TO_USE);
};

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(
    "Usage: node interact-with-local.js <network> <smart contract address>"
  );
  process.exit(1);
}

run(args[0], args[1]);
