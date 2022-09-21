const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");
const moment = require('moment')

const createBook = async function (req, res) {
    try {
        let data = req.body;

        let { title, excerpt, userId, ISBN, category, subategory, releasedAt } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Details" })
        }

        if (!title) { return res.status(400).send({ status: false, msg: "Title must be required !" }) }

        if (!excerpt) { return res.status(400).send({ status: false, msg: "excerpt must be required !" }) }

        if (!userId) { return res.status(400).send({ status: false, msg: "userId must be required !" }) }

        if (!ISBN) { return res.status(400).send({ status: false, msg: "ISBN must be required !" }) }

        if (!category) { return res.status(400).send({ status: false, msg: "category must be required !" }) }

        // if (!subategory) { return res.status(400).send({ status: false, msg: "subcategory must be required !" }) }

        if (!releasedAt) { return res.status(400).send({ status: false, msg: "releasedAt must be required !" }) }

        let savedata = await bookModel.create(data)

        res.status(201).send({ status: true, msg: savedata });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

};

module.exports = { createBook };
