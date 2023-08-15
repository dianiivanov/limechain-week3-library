const { ethers } = require("ethers");
const BookLibrary = require("./artifacts/contracts/BookLibrary.sol/BookLibrary.json");
require("dotenv").config();
const { getLibraryUtils } = require("./libraryUtils");

const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const LOCALHOST_URL = process.env.LOCALHOST_URL;
const BOOK_TO_USE = "Book1";

const run = async function (libraryContractAddress) {
  const provider = new ethers.JsonRpcProvider(LOCALHOST_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const libraryContract = new ethers.Contract(
    libraryContractAddress,
    BookLibrary.abi,
    wallet
  );

  const libraryUtils = getLibraryUtils(libraryContract);

  console.log(`Creating ${BOOK_TO_USE}...`);
  await libraryUtils.createBook(BOOK_TO_USE, 10);
  await libraryUtils.logIfBorrowedAndBookCopies(BOOK_TO_USE);
  console.log("Books in the library:", await libraryUtils.checkAllBooks());

  console.log(`Renting ${BOOK_TO_USE}...`);
  await libraryUtils.rentABook(BOOK_TO_USE);
  await libraryUtils.logIfBorrowedAndBookCopies(BOOK_TO_USE);

  console.log(`Returning  ${BOOK_TO_USE}...`);
  await libraryUtils.returnABook(BOOK_TO_USE);
  await libraryUtils.logIfBorrowedAndBookCopies(BOOK_TO_USE);
};

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log("Usage: node interact-with-local.js <smart contract address>");
  process.exit(1);
}

run(args[0]);
