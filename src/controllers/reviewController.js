const bookModel = require('../Models/bookModel')
const reviewModel = require('../Models/reviewModel')
const mongoose = require('mongoose')


const createReview = async (req, res) =>{
    const rBookId = req.params.bookId

    const {reviewedBy, rating, review} = req.body

    const findBooks = await bookModel.findOne({isDeleted:false, _id: rBookId})
    if(!findBooks){
        return res.send({status:false, message: "No Books Found...."})
    }
   let  obj = {bookId:findBooks._id, reviewedBy, rating, review }

    let  createReview = await reviewModel.create(obj)

    res.status(201).send({status:true, message:"success",data: createReview})

    // console.log(findBooks)
  
}

const deletReview = async function (req, res) {

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


        let deletReview = await reviewModel.findOneAndUpdate({ _id:reviewId, bookId: bookId, isDeleted:false },

             { $set: { isDeleted: true, deletedAt: new Date(), reviews:bookData.reviews-1 } },{ new: true })

        if (!deletReview) { return res.status(404).send({ status: false, message: "Review not Exist!" }) }

        return res.status(200).send({ status: true, message: "Deleted Successfully", })


    } catch (error) {
        res.status(500).send({ status: false, message: error })
    }
}


module.exports = {createReview, deletReview}