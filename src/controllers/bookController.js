// const userModel = require("../Models/userModel")
const bookModel = require("../Models/bookModel");
const moment = require('moment')

const createBook = async function (req, res) {
    try {
        let data = req.body;

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Details" })
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
const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let findBook = await bookModel.findById(bookId)
        if (findBook.isDeleted == true) return res.status(404).send({ status: false, msg: "requested book is already deleted" })

        let details = req.body
        if (Object.keys(details) == 0) return res.status(400).send({ status: false, msg: "Please provide details" })

        if (findBook.title == details.title) return res.status(404).send({ status: false, msg: "Title is already used" })
        if (findBook.ISBN == details.ISBN) return res.status(404).send({ status: false, msg: "ISBN is already used" })


        let updatedBook = await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $set: { title: details.title, excerpt: details.excerpt, releasedAt: details.releasedAt, ISBN: details.ISBN } }, { new: true }
        )

        return res.status(201).send({ status: false, msg: updatedBook })
    } catch (error) {
        return res.status(500).send({ msg: error.message });
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


module.exports = { createBook, deletedBooks, updateBooks };
