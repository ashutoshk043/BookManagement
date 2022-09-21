const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const commonMiddleware = require("../middleware/commonMiddleware")

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

router.post("/books/:bookId",userController.getBooksById)






module.exports = router;
