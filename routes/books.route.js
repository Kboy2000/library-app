const express = require("express")
const router = express.Router();

  var books= [
    {
      bookId: 1,
      bookName: "Things fall apart",
      price: "$2.99",
      category: "Historical fiction",
      author: "Chinua Achebe"
    },
    {
      bookId: 2,
      bookName: "Half of a yellow sun",
      price: "$3.99",
      category: "Historical fiction",
      author: "Chimamanda Adichie"
    },
    {
      bookId: 3,
      bookName: "The richest man in babylon",
      price: "$7.99",
      category: "Business",
      author: "George S Clason"
    },
    {
      bookId: 4,
      bookName: "The intelligent investor",
      price: "$11.99",
      category: "Business",
      author: "Benjamin Graham"
    },
    {
      bookId: 5,
      bookName: "The five love languages",
      price: "$7.99",
      category: "Romance",
      author: "Gary Chapman"
    },
    {
      bookId: 6,
      bookName: "Purple Hibiscus",
      price: "$199.99",
      category: "BildungsRoman",
      author: "Chimamanda Adichie"
    }
  ]
  
  //HELPER FUNCYION TO GENERATE UNIQUE IDS
  const generateId = () => {
    return books.length > 0 ? Math.max(...books.map((u) => u.bookId)) + 1 : 1;
  };
  
  //INPUT VALIDATION MIDDLEWARE
  const validateUserInput = (req, res, next) => {
    const { bookName, price, category, author } = req.body;
    if (!bookName ||!price||!category||!author|| typeof bookName !== "string"|| typeof category !== "string"|| typeof author !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Fields are required and must be a string",
      });
    }

    next();
  };
  const checkDuplicate = (req, res, next) => {
    let newBook = req.body;
    let book = books.find((book) => book.email === newBook.email); //make the bookId a number
    if (book) {
      res.status(400).json({
        status: "error",
        message: "email taken",
      });
    }
    next();
  };
  
  //middleware for authorization
  
  const authorizationMiddleware= (req,res,next)=>{
    const myToken = process.env.MY_SECRET;
    const token = req.headers["authorization"]
    if (!token||token!==myToken) {
      res.status(401).json({
        status:"error",
        message:"Access denied",
      })
    }
    next()
    
    }
    
    
    router.get("/protected", authorizationMiddleware,(req,res)=>{
    res.status(200).json({
      status:"success",
      message:"Access Granted",
      data:books
    })
    })
  
  router.get("/:bookId", (req, res) => {
    let bookId = parseInt(req.params.bookId); //gets the bookId of the book to be updated
    book = books.find((book) => book.bookId === bookId); //make the bookId a number
    if (!book) {
      res.status(404).json({
        status: "failure",
        message: "book not found",
        data: "",
      });
    }
    res.status(200).json({
      status: "success",
      message: "book found",
      data: book,
    });
  });
  //SEND A GET REQUEST TO ALL books OR READ
  router.get("/", (req, res) => {
    //EXTRACT QUERY PARAMETER FROM FILTERING
    const { category } = req.query;
  
    //FILTER books IF QUERY PARAM EXISTS
    let filteredBooks = books;
    if (category) {
      filteredBooks = books.filter(
        (book) => book.category.toLowerCase() === category.toLowerCase()
      );
    }
  
    res.status(200).json({
      status: "success",
      message: filteredBooks.length> 0 ? "books retrieved successfully" : "books not found",
      data: filteredBooks,
      total: filteredBooks.length,
    });
  });
  
  //ADD book OR CREATE
  router.post("/", (req, res) => {
    let newBook = req.body; //gets the new book from the request body
    newBook.bookId = generateId(); //gives the bookId of the new book
    if (!newBook.category) {
      newBook.category = "item";
    }
  
    books.push(newBook); //add the new book to the list of books
    res.status(201).json(newBook); //send the new book back to the client
  });
  
  //UPDATE book OR UPDATE
  router.patch("/:bookId", (req, res) => {
    let bookId = parseInt(req.params.bookId); //gets the bookId of the book to be updated
    book = books.find((book) => book.bookId === bookId); //make the bookId a number
  
    if (!book) {
      return res.status(404).json({ 
        status: "error",
        message: `No book with bookId ${bookId} found` }); //if the book is not found
    }
    book.bookName = req.body.bookName || book.bookName; //use the bookName from the request body or the current bookName
    book.price = req.body.price || book.price; //use the price from the request body or the current email
    book.category = req.body.category || book.category; //use the category from the request body or the current email
    book.author = req.body.author || book.author; //use the author from the request body or the current email
    res.send(book);
  
    res.status(200).json({
      status: "success",
      message: "book successfully updated",
      data: book,
    });
  });
  
  //DELETE book OR DELETE
  router.delete("/:bookId", (req, res) => {
    let bookId = parseInt(req.params.bookId); //gets the bookId of the book to be deleted
    const index = books.findIndex((book) => book.bookId === bookId);
    if (index === -1) {
      return res.status(404).json({
        status: "error",
        message: "book not found ",
      });
    }
    // books.deleteOne({bookId: bookId})
    books.splice(index, 1);
    // book= books.filter(u=>u.bookId===bookId);
    res.status(200).json({
      status: "success",
      message: `book with bookId ${bookId} successfully deleted` });
  });
  
module.exports=router