const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const commonMiddleware = require("../middleware/commonMiddleware")
const getBookscontroller = require("../controllers/getBookController")
const reviewController = require('../controllers/reviewController')
// ------------POST REGISTER-----------------
router.post("/register",userController.createUser)

// ---------------POST LOGIN------------------
router.post("/login",userController.login)

// --------------POST BOOKS-------------------
router.post("/books",commonMiddleware.Authentication ,bookController.createBook)

// ------------GET BOOKS-----------------
router.get("/books",commonMiddleware.Authentication, getBookscontroller.getbooks)

// -------------GET BOOKSBYID------------------------
router.get("/books/:bookId", commonMiddleware.Authentication, getBookscontroller.getBooksById)

// -------------UPDATE-------------------
router.put("/books/:bookId"  ,commonMiddleware.Authentication, commonMiddleware.Authorisation, bookController.updateBook)

// -------------DELETE------------------
router.delete("/books/:bookId" ,commonMiddleware.Authentication, commonMiddleware.Authorisation  ,bookController.deletedBooks)

//----------Post book review---------------------
router.post('/books/:bookId/review', reviewController.createReview)

// ---------------POST REVIEW-------------------
router.put("/books/:bookId/review/:reviewId" , reviewController.updateReview)

router.put("/books/:bookId/review/:reviewId" , reviewController.deleteReview)


module.exports = router;
