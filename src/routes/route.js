const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const commonMiddleware = require("../middleware/commonMiddleware")
const getBookscontroller = require("../controllers/getBookController")
// ------------POST REGISTER-----------------
router.post("/register",userController.createUser)

// ---------------POST LOGIN------------------
router.post("/login",userController.loginUser)

// --------------POST BOOKS-------------------
router.post("/books",commonMiddleware.Authentication,commonMiddleware.Authorization,bookController.createBook)

// ------------GET BOOKS-----------------
router.get("/books",getBookscontroller.getbooks)

// -------------GET BOOKSBYID------------------------
router.get("/books/:bookId",getBookscontroller.getBooksById)

// -------------UPDATE-------------------
router.put("/books/:bookId" , bookController.updateBook)

// -------------DELETE------------------
router.delete("/books/:bookId" , bookController.deletedBooks)


module.exports = router;
