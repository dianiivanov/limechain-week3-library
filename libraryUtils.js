const { ethers } = require("ethers");

const createBook = async function (libraryContract, bookName, copies) {
  const addBooksTx = await libraryContract.addBooks(bookName, copies);
  const addBooksReceipt = await addBooksTx.wait();
  logIfUnsuccessful(addBooksReceipt);
  return addBooksReceipt;
};

const getBooksLength = async function (libraryContract) {
  return await libraryContract.getBooksLength();
};

const checkAllBooks = async function (libraryContract) {
  const books = await libraryContract.getBooksPage(
    0,
    await getBooksLength(libraryContract)
  );
  return books.join(", ");
};

const rentABook = async function (libraryContract, bookName) {
  const rentABookTx = await libraryContract.borrow(bookName);
  const rentABookReceipt = await rentABookTx.wait();
  logIfUnsuccessful(rentABookReceipt);
  return rentABookReceipt;
};

const returnABook = async function (libraryContract, bookName) {
  const returnABookTx = await libraryContract.returnBook(bookName);
  const returnABookReceipt = await returnABookTx.wait();
  logIfUnsuccessful(returnABookReceipt);
  return returnABookReceipt;
};

const checkIfSenderBorrowed = async function (libraryContract, bookName) {
  return await libraryContract.isBookBorrowed(bookName);
};

const getBooksCopies = async function (libraryContract, bookName) {
  return (await libraryContract.getBookCopies(bookName)).toString();
};

const logIfUnsuccessful = async function (receipt) {
  if (receipt.status != 1) {
    console.log("Transaction was not successful");
  }
};

const logIfBorrowedAndBookCopies = async function (libraryContract, bookName) {
  console.log(
    `Has sender borrowed the book, ${bookName}:`,
    await checkIfSenderBorrowed(libraryContract, bookName)
  );
  console.log(
    `Copies of, ${bookName} left:`,
    await getBooksCopies(libraryContract, bookName)
  );
};

module.exports = {
  createBook,
  getBooksLength,
  checkAllBooks,
  rentABook,
  returnABook,
  getBooksCopies,
  logIfUnsuccessful,
  logIfBorrowedAndBookCopies,
};
