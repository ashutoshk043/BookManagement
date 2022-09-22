// const userModel = require("../Models/userModel")
const bookModel = require("../Models/bookModel");
<<<<<<< HEAD
=======
const moment = require('moment')
const mongoose = require('mongoose')
>>>>>>> 705b4919ce95b8b88a05f0eb17de6933be6c1a8d


const createBook = async function (req, res) {
    try {
        let data = req.body;

<<<<<<< HEAD
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        

=======
>>>>>>> 705b4919ce95b8b88a05f0eb17de6933be6c1a8d
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Details" })
        }

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        

        if (!mongoose.isValidObjectId(req.body.userId)) {
            return res.status(400).send({ status: false, message: "Enter valid userId" });
          }

        if (!title) { return res.status(400).send({ status: false, msg: "Title must be required !" }) }

        let titleVerify = await bookModel.findOne({ title: title })

        if (titleVerify) {
            return res.status(400).send({ status: false, msg: "this title already exists please provide another title" })
        }

        if (!excerpt) { return res.status(400).send({ status: false, msg: "excerpt must be required !" }) }

        if (!userId) { return res.status(400).send({ status: false, msg: "userId must be required !" }) }

        if (!ISBN) { return res.status(400).send({ status: false, msg: "ISBN must be required !" }) }

        if (!(/[0-9]*[-| ][0-9]*[-| ][0-9]*[-| ][0-9]*[-| ][0-9]*/
        ).test(ISBN)) { return res.status(400).send({ status: false, msg: " provide 13 digit ISBN number" }) }

        let ISBNVerify = await bookModel.findOne({ ISBN: ISBN })

        if (ISBNVerify) {
            return res.status(400).send({ status: false, msg: "this ISBN already exists please provide another ISBN" })
        }

        if (!category) { return res.status(400).send({ status: false, msg: "category must be required !" }) }

        if (!subcategory) { return res.status(400).send({ status: false, msg: "subcategory must be required !" }) }

        if (!releasedAt) { return res.status(400).send({ status: false, msg: "releasedAt must be required !" }) }

        let savedata = await bookModel.create(data)

        return res.status(201).send({ status: true, msg: savedata });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

};



const deletedBooks = async function (req, res) {
    try {
        let bookIdData = req.params.bookId;

        let book = await bookModel.findById(bookIdData);


        if (book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No book exists" });

        }

        let deletedBooks = await bookModel.findByIdAndUpdate({ _id: bookIdData },
            { isDeleted: true, deletedAt: new Date() }, { new: true });

        res.status(200).send({ status: true, data: deletedBooks })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }

};



const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(req.params.bookId)) {
            return res.status(400).send({ status: false, message: "Enter valid bookId" });
          }

        let data = req.body;

        const { title, excerpt, releasedAt, ISBN } = data;

        let checkTitle = await bookModel.findOne({title})

        if (checkTitle) {
            return res.status(400).send({ status: false, msg: "Title already exist...!! Use another Title" });
        }
        let checkIsbn = await bookModel.findOne({ ISBN })

        if (checkIsbn) {
            return res.status(400).send({ status: false, msg: "ISBN already exist....!! Use another ISBN" });
        }

        let dataBooks = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            {
                $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }
            },
            { new: true }
        );

        if (!dataBooks) {
            return res.status(404).send({ status: false, msg: "bookId does not exist or deleted" });
        }

        res.status(200).send({ status: true, msg: "Document Updated Successfully", data: dataBooks })

    }

    catch (error) {
        res.status(500).send({ status: false, msg: error })
    }
};

module.exports = { createBook, updateBook, deletedBooks };
