const { default: mongoose } = require("mongoose");
const bookModel = require("../Models/bookModel");
const reviewModel = require("../Models/reviewModel");

var valRating = /^[1-5]*$/;

const isValids = (val) => {
  if (typeof val === null || typeof val === "undefined") return false;
  if (typeof val === "string" && val.trim().length < 1) return false;
  return true;
};

//----------------------------------------------------createReview----------------------------------------------//

const createReview = async (req, res) => {
  try {

    const rBookId = req.params.bookId;
    const { reviewedBy, rating, reviewedAt, review } = req.body;

    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({ status: false, message: "Please Enter Details" })
    }


    if (!mongoose.Types.ObjectId.isValid(rBookId)) {
      return res.status(400).send({ status: false, message: "Invalid BookId in path params..." });
    }


    if (!isValids(rating) || !isValids(review)) {
      return res.status(400).send({ status: false, message: "Blanks fields are not allowed..." });
    }
    if (!rating) { return res.status(400).send({ status: false, message: "rating must be required !" }) }

    if (!valRating.test(rating)) {
      return res.status(400).send({ status: false, message: "Please rate between 1 to 5 Only" });
    }


    if (!reviewedAt) { return res.status(400).send({ status: false, message: "reviewedAt must be required !" }) }

    if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).test(reviewedAt)) {

      return res.status(400).send({ status: false, message: "Enter valid reviewedAt" });
    }

    const findBooks = await bookModel.findOne({ isDeleted: false, _id: rBookId });
    if (!findBooks) {
      return res.status(404).send({ status: false, message: "No Books Found...." });
    }
    let obj = { bookId: findBooks._id, reviewedBy, reviewedAt, rating, review };

    let createReview = await reviewModel.create(obj);

    let ReviewBooks = {
      revieweId: createReview._id,
      bookId: createReview.bookId,
      reviewedBy: createReview.reviewedBy,
      reviewedAt: createReview.reviewedAt,
      rating: createReview.rating,
      review: createReview.review
    }

    let upDateReview = await bookModel.findOneAndUpdate(
      { _id: findBooks._id },
      { $inc: { reviews: 1 } },
      { new: true }
    );

    res.status(201).send({ status: true, message: "success", data: ReviewBooks });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

//----------------------------------------------------updateReview----------------------------------------------//

const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let { review, rating, reviewedBy } = req.body;

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    if (!mongoose.isValidObjectId(req.params.reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid reviewId" });
    }

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is required" });
    }

    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "reviewId is required" });
    }

    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide any input to update" });
    }

    const bookData = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select({ __v: 0, ISBN: 0 });

    if (!bookData) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }

    const updatedReview = await reviewModel.findOneAndUpdate( { _id: reviewId, bookId: bookId, isDeleted: false },
        {
          $set: {
            review: review,
            rating: rating,
            reviewedBy: reviewedBy,
            reviewedAt: new Date(),
          },
        },{ new: true }
      )
      .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    if (!updatedReview) {
      return res
        .status(404)
        .send({ status: false, message: "Review not exist" });
    }
    let responseData = { bookData, updatedReview};

    return res
      .status(200)
      .send({ status: true, message: "book list", data: responseData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

//------------------------------------------------DELETEREVIEW---------------------------------------------

const deleteReview = async function (req, res) {

  try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId

    if (!bookId) { return res.status(400).send({ status: false, message: "please provide bookId" }) }

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res.status(400).send({ status: false, message: "Enter valid bookId" });
    }

    if (!reviewId) { return res.status(400).send({ status: false, message: "please provide reviewId" }) }

    if (!mongoose.isValidObjectId(req.params.reviewId)) {
      return res.status(400).send({ status: false, message: "Enter valid reviewId" });
    }

    const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, ISBN: 0 });

    if (!bookData) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }


    let deletReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false },

      { $set: { isDeleted: true, deletedAt: new Date(), reviews: bookData.reviews - 1 } }, { new: true })

    if (!deletReview) { return res.status(404).send({ status: false, message: "Review not Exist!" }) }

    return res.status(200).send({ status: true, message: "Deleted Successfully" })


  } catch (error) {
    res.status(500).send({ status: false, message: error })
  }
}

module.exports = { createReview, updateReview, deleteReview }
