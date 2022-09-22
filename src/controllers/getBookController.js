const mongoose =require("mongoose")
const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");
const reviewModel = require("../models/reviewModel")




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
                    isDeleted: book.isDeleted, releasedAt: book.releasedAt, createdAt: book.createdAt, updatedAt: book.updatedAt, reviewsData: book.reviewsData
                }
                return res.status(200).send({ status: true, message: 'Books list', data: Book });
        
            } catch (err) {
                res.status(500).send({ status: false, message: err.message });
            }
        }


module.exports = { getBooksById }