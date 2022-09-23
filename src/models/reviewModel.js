const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    //     bookId: {ObjectId, mandatory, refs to book model},
    bookId: {
        type: ObjectId,
        require: true,
        ref: 'book'
    },
    //     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
    reviewedBy: {
        type: String,
        require: true,
        default: 'Guest',

    },
    //     reviewedAt: {Date, mandatory},
    reviewedAt: {
        type: Date,
        require: true
    },
    //     rating: {number, min 1, max 5, mandatory},
    rating: {
        type: Number,
        require: true,
        min : 1,
        max: 5
    },
    //     review: {string, optional}
    review: {
        type: String
    },
    //     isDeleted: {boolean, default: false},
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('review', reviewSchema)

