const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
    {

        bookId: {
            type: ObjectId,
            required: true,
            unique: true,
            ref: "book",
        },
        reviewedBy:
        {
            type: String,
            require: true,
            default: 'Guest',
            value: {
                type: String
            }
        },

        reviewedAt:
        {
            type: Date,
            unique: true
        },
        rating:
        {
            type: Number,
            required: true
        },

        review:
            { type: String },
        isDeleted:
        {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true })

module, exports = mongoose.model("review", reviewSchema)