import { BookLibrary } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookLibrary", function() {
    let bookLibrary: BookLibrary;
    before(async() => {
        // const StringsPagination = await ethers.getContractFactory("StringsPagination");
        // const stringsPagination = await StringsPagination.deploy();
        // const stringsPagination = await ethers.deployContract("StringsPagination");
        // console.log("stringsPagination address:", stringsPagination);
        // const BookLibrary = await ethers.getContractFactory("BookLibrary",{
        //     libraries: {
        //         StringsPagination: stringsPagination.address,
        //     }
        // });
        const BookLibraryFactory = await ethers.getContractFactory("BookLibrary");
        bookLibrary = await BookLibraryFactory.deploy();

        console.log("Deployed for testing");
    });
    it("Should return the newly added book after a new book is added and books length should be 1", async() => {
        await bookLibrary.addBooks("Book1", 10);
        const booksArray = await bookLibrary.getBooksPage(0, 1);

        expect(booksArray[0]).to.equal("Book1");
        expect(await bookLibrary.getBooksLength()).to.equal(1);
        expect(await bookLibrary.getBookCopies("Book1")).to.equal(10);
    });
    it("Should return the newly added book(along with the old ones) after a new book is added and books length should be 2", async() => {
        await bookLibrary.addBooks("Book2", 7);

        const booksArray = await bookLibrary.getBooksPage(0, 2);
        expect(booksArray[0]).to.equal("Book1");
        expect(booksArray[1]).to.equal("Book2");
        expect(await bookLibrary.getBooksLength()).to.equal(2);
        expect(await bookLibrary.getBookCopies("Book2")).to.equal(7);
    });
    it("Should increment books copies and not change books length after adding an already existing book", async() => {
        await bookLibrary.addBooks("Book2", 10);
        
        expect(await bookLibrary.getBooksLength()).to.equal(2);
        expect(await bookLibrary.getBookCopies("Book2")).to.equal(17);
    });
    it("Should revert when trying to addBooks with not the owner", async() => {
        const [owner, notOwner] = await ethers.getSigners();
        expect(bookLibrary.connect(notOwner).addBooks("Book2", 10)).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should revert with custom error StartingIndexIsMoreOrThanEqualToBooks when trying to get from starting idx more than the length books", async() => {
        await expect(bookLibrary.getBooksPage(3, 2)).to.be.revertedWithCustomError(bookLibrary, "StartingIndexIsMoreOrThanEqualToBooks");
    });
    it("Should revert with custom error StartingIndexIsMoreOrThanEqualToBooks when trying to get from starting idx equal to the length books", async() => {
        await expect(bookLibrary.getBooksPage(2, 2)).to.be.revertedWithCustomError(bookLibrary, "StartingIndexIsMoreOrThanEqualToBooks");
    });
    it("Should revert with custom error EndingIndexIsMoreThanBooks when trying to get to ending idx more than the length books", async() => {
        await expect(bookLibrary.getBooksPage(0, 3)).to.be.revertedWithCustomError(bookLibrary, "EndingIndexIsMoreThanBooks");
    });
    it("Should revert with custom error StartingIndexIsMoreOrEqualToEndingIndex when trying to get from starting idx more than the ending idx", async() => {
        await expect(bookLibrary.getBooksPage(1, 0)).to.be.revertedWithCustomError(bookLibrary, "StartingIndexIsMoreOrEqualToEndingIndex");
    });
    it("Should revert with custom error StartingIndexIsMoreOrEqualToEndingIndex when trying to get from starting idx equal to the ending idx", async() => {
        await expect(bookLibrary.getBooksPage(1, 1)).to.be.revertedWithCustomError(bookLibrary, "StartingIndexIsMoreOrEqualToEndingIndex");
    });
    it("Should return all books when using starting index 0 and ending index like books length ", async() => {
        await bookLibrary.addBooks("Book3", 1);
        const booksArray = await bookLibrary.getBooksPage(0, 3);

        expect(booksArray[0]).to.equal("Book1");
        expect(booksArray[1]).to.equal("Book2");
        expect(booksArray[2]).to.equal("Book3");
        expect(booksArray.length).to.equal(3);    
    });
    it("Should return first book when using starting index 0 and ending index 1", async() => {
        const booksArray = await bookLibrary.getBooksPage(0, 1);

        expect(booksArray[0]).to.equal("Book1");
        expect(booksArray.length).to.equal(1);    
    });
    it("Should return second book when using starting index 1 and ending index 2", async() => {
        const booksArray = await bookLibrary.getBooksPage(1, 2);

        expect(booksArray[0]).to.equal("Book2");
        expect(booksArray.length).to.equal(1);    
    });
    it("Should return second 2 books when using starting index 1 and ending index like books length ", async() => {
        const booksArray = await bookLibrary.getBooksPage(1, 3);

        expect(booksArray[0]).to.equal("Book2");
        expect(booksArray[1]).to.equal("Book3");
        expect(booksArray.length).to.equal(2);    
    });
    it("Should decrement copies of book by 1 when borrow book successfully ", async() => {
        const beforeBorrowCopies = await bookLibrary.getBookCopies("Book3");
        const [owner, user] = await ethers.getSigners();
        await bookLibrary.connect(user).borrow("Book3");

        expect(await bookLibrary.getBookCopies("Book3")).to.equal(Number(beforeBorrowCopies) - 1);    
    });
    it("Should revert with custom error BookAlreadyBorrowed when trying to borrow an already borrowed book ", async() => {
        const [owner, user] = await ethers.getSigners();
        await expect(bookLibrary.connect(user).borrow("Book3")).to.be.revertedWithCustomError(bookLibrary, "BookAlreadyBorrowed")
            .withArgs(user.address, "Book3");
    });
    it("Should revert with custom error BookUnavailable when trying to borrow an existing book with no free copies", async() => {
        const [owner] = await ethers.getSigners();
        await expect(bookLibrary.borrow("Book3")).to.be.revertedWithCustomError(bookLibrary, "BookUnavailable")
            .withArgs(owner.address, "Book3");
    });
    it("Should revert with custom error BookUnavailable when trying to borrow not existing book", async() => {
        const [owner, notOwner] = await ethers.getSigners();
        await expect(bookLibrary.connect(notOwner).borrow("asd")).to.be.revertedWithCustomError(bookLibrary, "BookUnavailable")
            .withArgs(notOwner.address,"asd");
    });
    it("Should return true as the book is borrowed", async() => {
        const [owner, user] = await ethers.getSigners();
        expect(await bookLibrary.connect(user).isBookBorrowed("Book3")).to.be.true;
    });
    it("Should increment copies of a book by 1 when return a book successfully ", async() => {
        const beforeBorrowCopies = await bookLibrary.getBookCopies("Book3");
        const [owner, user] = await ethers.getSigners();
        await bookLibrary.connect(user).returnBook("Book3");

        expect(await bookLibrary.getBookCopies("Book3")).to.equal(Number(beforeBorrowCopies) + 1);    
    });
    it("Should return true as the book is not borrowed", async() => {
        const [owner, user] = await ethers.getSigners();
        expect(await bookLibrary.connect(user).isBookBorrowed("Book3")).to.be.false;
    });
    it("Should revert with custom error BookNotBorrowed when returning a book that's not borrowed ", async() => {
        const beforeBorrowCopies = await bookLibrary.getBookCopies("Book3");
        const [owner] = await ethers.getSigners();
        await expect(bookLibrary.returnBook("Book3")).to.be.revertedWithCustomError(bookLibrary, "BookNotBorrowed")
            .withArgs(owner.address, "Book3");;
    });
    it("Should decrement copies of book by 1 when borrow book successfully", async() => {
        const beforeBorrowCopies = await bookLibrary.getBookCopies("Book3");
        await bookLibrary.borrow("Book3");

        expect(await bookLibrary.getBookCopies("Book3")).to.equal(Number(beforeBorrowCopies) - 1);    
    });
    it("Should return all 2 borrowers of a book borrowed by 2", async() => {
        const borrowers = await bookLibrary.getBooksBorrowers("Book3");

        const [owner, user] = await ethers.getSigners();
        expect(borrowers.length).to.equal(2);    
        expect(borrowers[0]).to.equal(user.address);
        expect(borrowers[1]).to.equal(owner.address);
    });
    it("Should return all 0 borrowers of a book borrowed by noone", async() => {
        const borrowers = await bookLibrary.getBooksBorrowers("Book1");

        expect(borrowers.length).to.equal(0);    
    });
    it("Should not add duplicate borrowers or change anyhow the borrowers result when borrow same book for a second time ", async() => {
        const [owner, user] = await ethers.getSigners();
        await bookLibrary.returnBook("Book3");
        await bookLibrary.connect(user).borrow("Book3");
        const borrowers = await bookLibrary.getBooksBorrowers("Book3");

        expect(borrowers.length).to.equal(2);    
        expect(borrowers[0]).to.equal(user.address);
        expect(borrowers[1]).to.equal(owner.address); 
    });
})
