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
router.post("/books",bookController.createBook)

// ------------GET BOOKS-----------------
router.get("/books",getBookscontroller.getBooks)

// -------------GET BOOKSBYID------------------------
router.get("/books/:bookId",getBookscontroller.getBooksById)






module.exports = router;
