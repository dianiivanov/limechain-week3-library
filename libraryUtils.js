function getLibraryUtils(libraryContract) {
  const createBook = async function (bookName, copies) {
    const addBooksTx = await libraryContract.addBooks(bookName, copies);
    const addBooksReceipt = await addBooksTx.wait();
    logIfUnsuccessful(addBooksReceipt);
    return addBooksReceipt;
  };

  const getBooksLength = async function () {
    return await libraryContract.getBooksLength();
  };

  const checkAllBooks = async function () {
    const books = await libraryContract.getBooksPage(0, await getBooksLength());
    return books.join(", ");
  };

  const rentABook = async function (bookName) {
    const rentABookTx = await libraryContract.borrow(bookName);
    const rentABookReceipt = await rentABookTx.wait();
    logIfUnsuccessful(rentABookReceipt);
    return rentABookReceipt;
  };

  const returnABook = async function (bookName) {
    const returnABookTx = await libraryContract.returnBook(bookName);
    const returnABookReceipt = await returnABookTx.wait();
    logIfUnsuccessful(returnABookReceipt);
    return returnABookReceipt;
  };

  const checkIfSenderBorrowed = async function (bookName) {
    return await libraryContract.isBookBorrowed(bookName);
  };

  const getBooksCopies = async function (bookName) {
    return (await libraryContract.getBookCopies(bookName)).toString();
  };

  const logIfUnsuccessful = async function (receipt) {
    if (receipt.status != 1) {
      console.log("Transaction was not successful");
    }
  };

  const logIfBorrowedAndBookCopies = async function (bookName) {
    console.log(
      `Has sender borrowed the book, ${bookName}:`,
      await checkIfSenderBorrowed(bookName)
    );
    console.log(`Copies of, ${bookName} left:`, await getBooksCopies(bookName));
  };

  return {
    createBook,
    getBooksLength,
    checkAllBooks,
    rentABook,
    returnABook,
    getBooksCopies,
    logIfUnsuccessful,
    logIfBorrowedAndBookCopies,
  };
}

module.exports = {
  getLibraryUtils,
};
