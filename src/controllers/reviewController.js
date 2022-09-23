const { default: mongoose } = require("mongoose");
const bookModel = require("../Models/bookModel");
const reviewModel = require("../Models/reviewModel");

var valRating = /^[1-5]*$/;

const isValids = (val) => {
  if (typeof val === null || typeof val === "undefined") return false;
  if (typeof val === "string" && val.trim().length < 1) return false;
  return true;
};

const createReview = async (req, res) => {
try {
    
  const rBookId = req.params.bookId;
  const { reviewedBy, rating, review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(rBookId)) {
    return res
      .status(401)
      .send({ status: false, message: "Invalid BookId..." });
  }
  if (!isValids(rating) || !isValids(review)) {
    return res
      .status(401)
      .send({ status: false, message: "Blanks fields are not allowed..." });
  }
  if (!valRating.test(rating)) {
    return res
      .status(401)
      .send({ status: false, message: "Please rate between 1 to 5 Only" });
  }

  const findBooks = await bookModel.findOne({ isDeleted: false, _id: rBookId });
  if (!findBooks) {
    return res
      .status(401)
      .send({ status: false, message: "No Books Found...." });
  }
  let obj = { bookId: findBooks._id, reviewedBy, rating, review };

  let createReview = await reviewModel.create(obj);

  let upDateReview = await bookModel.findOneAndUpdate(
    { _id: findBooks._id },
    { $inc: { reviews: 1 } },
    { new: true }
  );

  res
    .status(201)
    .send({ status: true, message: "success", data: createReview });
} catch (error) {
    res.status(500).send({status: false, message: error.message})
}
}

module.exports = { createReview };
