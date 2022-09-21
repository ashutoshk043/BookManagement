const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const commonMiddleware = require("../middleware/commonMiddleware")

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

<<<<<<< HEAD
router.post("/books/:bookId",userController.getBooksById)
=======
router.post("/books",bookController.createBook)
>>>>>>> e97f931bc3557f2922aa13fec4c33372cc4af306






module.exports = router;
