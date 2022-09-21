const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");



const getBooks = async (req, res) => {

    if (Object.keys(req.query).length < 1) {
        const findBooks = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        res.status(200).send({ status: true, message: "Success", data: findBooks })
    } else {
        const { userId, category, subcategory } = req.query

        let filterBooks = await bookModel.find({
            $and: [
                {
                    $and: [{ isDeleted: false }],
                    $or: [{
                        $or: [
                            { "userId": { $in: userId } },
                            { "category": { $in: category } },
                            { "subcategory": { $in: [subcategory] } }
                        ]
                    }]
                },
            ]
        }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        res.status(200).send({ status: true, message: "Success", data: filterBooks })

    }

}










const getBooksById = async (req, res) => {
    const rBookId = req.params

    // const findBooks = await bookModel.find()
    // res.status(200).send({status:true, message:"Success", data:findBooks})

}

module.exports = { getBooks, getBooksById }