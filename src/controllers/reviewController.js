const bookModel = require('../Models/bookModel')
const reviewModel = require('../Models/reviewModel')


const createReview = async (req, res) =>{
    const rBookId = req.params.bookId

    const {reviewedBy, rating, review} = req.body

    const findBooks = await bookModel.findOne({isDeleted:false, _id: rBookId})
    if(!findBooks){
        return res.send({status:false, message: "No Books Found...."})
    }
   let  obj = {bookId:findBooks._id,reviewedBy, rating, review }
    let  createReview = await reviewModel.create(obj)

    res.status(201).send({status:true, message:"success",data: createReview})

    // console.log(findBooks)
    



    
}

module.exports = {createReview}