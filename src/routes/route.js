const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const commonMiddleware = require("../middleware/commonMiddleware")
const getBookscontroller = require("../controllers/getBookController")

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

router.post("/books",bookController.createBook)

router.get("/books",getBookscontroller.getBooks)

router.get("/books/:bookId",getBookscontroller.getBooksById)






module.exports = router;
