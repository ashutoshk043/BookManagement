// const userModel = require("../Models/userModel")
const bookModel = require("../Models/bookModel");
const moment = require('moment')

const createBook = async function (req, res) {
    try {
        let data = req.body;

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Details" })
        }

        if (!title) { return res.status(400).send({ status: false, msg: "Title must be required !" }) }

        let titleVerify = await bookModel.findOne({ title: title })

        if (titleVerify) {
            return res.status(400).send({ status: false, msg: "this title already exists please provide another title" })
        }

        if (!excerpt) { return res.status(400).send({ status: false, msg: "excerpt must be required !" }) }

        if (!userId) { return res.status(400).send({ status: false, msg: "userId must be required !" }) }

        if (!ISBN) { return res.status(400).send({ status: false, msg: "ISBN must be required !" }) }

        if (!(/[0-9]*[-| ][0-9]*[-| ][0-9]*[-| ][0-9]*[-| ][0-9]*/
            ).test(ISBN)) { return res.status(400).send({ status: false, msg: " provide 13 digit ISBN number" }) }

        let ISBNVerify = await bookModel.findOne({ ISBN: ISBN })

        if (ISBNVerify) {
            return res.status(400).send({ status: false, msg: "this ISBN already exists please provide another ISBN" })
        }

        if (!category) { return res.status(400).send({ status: false, msg: "category must be required !" }) }

        if (!subcategory) { return res.status(400).send({ status: false, msg: "subcategory must be required !" }) }

        if (!releasedAt) { return res.status(400).send({ status: false, msg: "releasedAt must be required !" }) }

        let savedata = await bookModel.create(data)

        res.status(201).send({ status: true, msg: savedata });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

};



const updateBook = async function (req, res) {
    try {
      let bookId = req.params.bookId;
      
      let Id = await bookModel.findById({ _id: bookId });
  
      if (!Id) {
        return res.status(404).send({ status: false, msg: "bookId does not exist" });
      }

    //   if(!bookId){
    //     return res.status(404).send({ status: false, msg: "use valid bookId " });
    //   }

      let data = req.body;
  
      const { title, excerpt, releasedAt, ISBN } = data;
  
      let checkTitle = await bookModel.findOne({title:title})
      
      if(checkTitle)
      {
        return res.status(400).send({ status: false, msg: "Title already exist...!! Use another Title" });
      }
      let checkIsbn = await bookModel.findOne({ISBN:ISBN})
      
      if(checkIsbn)
      {
        return res.status(400).send({ status: false, msg: "ISBN already exist....!! Use another ISBN" });
      }
      
      
      



    //   if(Id.isDeleted==true){
    //     return res.status(404).send({ status: false, msg: "books does not exist" });
    //   }



  
      let dataBooks = await bookModel.findOneAndUpdate(
        { _id: bookId, isDeleted: false },
        {
          $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN:ISBN }},
        { new: true }
      );

      if(!dataBooks){
        return res.status(404).send({ status: false, msg: "bookId does not exist or deleted" });
      }

      res.status(200).send({ status: true, msg: "Document Updated Successfully", data: dataBooks })

    }

    catch (error) {
      res.status(500).send({ status: false, msg: error })
    }
  };

module.exports = { createBook, updateBook };