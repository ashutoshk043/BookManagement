const mongoose = require("mongoose")
// const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");
const reviewModel = require("../Models/reviewModel")

// --------------GET BOOKS--------------------
const getBooks = async function (req, res) {
    try {
      let data = req.query;
  
  
      if (req.query.userId) {
        if (!mongoose.isValidObjectId(req.query.userId)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter valid userId" });
        }
      }
  
      let obj = { isDeleted: false, ...data };
  
      let books = await bookModel
        .find(obj)
        .select("_id title excerpt userId category releasedAt reviews");
  
      if (books.length == 0) {
        return res.status(404).send({ status: false, message: "No Book Found" });
      }
  
      let booksData = books.sort(function (a, b) {
        // return a.title - b.title;
        return a.title.localeCompare(b.title);
      });
  
      return res
        .status(200)
        .send({ status: true, message: "Book List", data: booksData });
    } catch (error) {
      return res.status(500).send({ status: false, message: error });
    }
  };

// -----------------------GET BOOKS BY ID------------------------- //

const getBooksById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, msg: "bookId is not valid" }) }

        const book = await bookModel.findOne({ _id : bookId , isDeleted : false})
    

        if (!book) return res.status(404).send({ status: false, message: "No book found from this bookId" })

        const reviewsData = await reviewModel.find({ bookId: book._id }).select('_Id bookId reviewedBy reviewedAt rating review')

        if (!reviewsData) return res.status(404).send({ status: false, message: "No book found from this bookId" })

        book.reviewsData = reviewsData

        let Book = {
            _id: book._id, title: book.title, excerpt: book.excerpt, userId: book.userId, category: book.category, subcategory: book.subcategory,
            isDeleted: book.isDeleted, reviews: book.reviews, releasedAt: book.releasedAt,createdAt: book.createdAt, updatedAt: book.updatedAt, reviewsData: book.reviewsData
        }
        return res.status(200).send({ status: true, message: 'Books list', data: Book });

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = { getBooks, getBooksById }