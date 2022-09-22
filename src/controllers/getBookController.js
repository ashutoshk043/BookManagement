const mongoose = require("mongoose")
const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");
const reviewModel = require("../models/reviewModel")

// --------------GET BOOKS--------------------
const getbooks = async function (req, res) {
    try {
        let queries = req.query;

        let isValid = mongoose.Types.ObjectId.isValid(req.query.userId)

        if (Object.keys(queries).length != 0) {
            if (req.query.userId) {
                if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid User ID" }) }
            }
        }

        let allBooks = await bookModel.find({ $and: [queries, { isDeleted: false }] }).select({
            title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1
        })

        const sortedBooks = allBooks.sort((a, b) => a.title.localeCompare(b.title));

        if (allBooks.length == 0) return res.status(404).send({ status: false, msg: "No book found" });

        return res.status(200).send({ status: true, data: sortedBooks });
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}

// -----------------------GET BOOKS BY ID-------------------------

const getBooksById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, msg: "bookId is not valid" }) }

        const book = await bookModel.findById(bookId)

        if (!book) return res.status(404).send({ status: false, message: "No book found from this bookId" })

        const reviewsData = await reviewModel.find({ bookId: book._id })
        if (!reviewsData) return res.status(404).send({ status: false, message: "No book found from this bookId" })

        book.reviewsData = reviewsData

        let Book = {
            _id: book._id, title: book.title, excerpt: book.excerpt, userId: book.userId, category: book.category, subcategory: book.subcategory,
            isDeleted: book.isDeleted, releasedAt: book.releasedAt, reviewsData: book.reviewsData
        }
        return res.status(200).send({ status: true, message: 'Books list', data: Book });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = { getbooks, getBooksById }