const bookModel = require("../Models/bookModel");
const mongoose = require('mongoose')
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
 
     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket",  //HERE
         Key: "abc/" + file.originalname, //HERE 
         Body: file.buffer
     }
 
 
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
         return resolve(data.Location)
     })

 
    })
 }

const createBook = async function (req, res) {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter Details" })
        }

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, bookCover } = data;


        if (!mongoose.isValidObjectId(req.body.userId)) {
            return res.status(400).send({ status: false, message: "Enter valid userId" });
        }

        if (!title) { return res.status(400).send({ status: false, msg: "Title must be required !" }) }

        let titleVerify = await bookModel.findOne({ title: title })

        if (titleVerify) {
            return res.status(400).send({ status: false, msg: "this title already exists please provide another title" })
        }

        if (!excerpt) { return res.status(400).send({ status: false, msg: "excerpt must be required !" }) }

        if (!userId) { return res.status(400).send({ status: false, msg: "userId must be required !" }) }

        if (!ISBN) { return res.status(400).send({ status: false, msg: "ISBN must be required !" }) }

        if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
        ).test(ISBN.trim())) { return res.status(400).send({ status: false, msg: " provide 13 digit ISBN number" }) }

        let ISBNVerify = await bookModel.findOne({ ISBN: ISBN })

        if (ISBNVerify) {
            return res.status(400).send({ status: false, msg: "this ISBN already exists please provide another ISBN" })
        }

        if (!category) { return res.status(400).send({ status: false, msg: "category must be required !" }) }

        if (!subcategory) { return res.status(400).send({ status: false, msg: "subcategory must be required !" }) }

        if (!releasedAt) { return res.status(400).send({ status: false, msg: "releasedAt must be required !" }) }
        // Aws codes here
        let  files= req.files
        if(!(files && files.length)){
            return res.status(401).send({status:"false", msg: "Found Error in Uploading files..."})
        }
        let fileUploaded = await uploadFile(files[0])
        data.bookCover = fileUploaded

        let savedata = await bookModel.create(data)

        let  resBookData = {
            _id: savedata._id,
            title: savedata.title,
            excerpt: savedata.excerpt,
            userId: savedata.userId,
            ISBN: savedata.ISBN,
            category: savedata.category,
            subcategory: savedata.subcategory,
            isDeleted: savedata.isDeleted,
            reviews: savedata.reviews,
            releasedAt: savedata.releasedAt,
            createdAt: savedata.createdAt,
            updatedAt: savedata.updatedAt,
            bookCover: savedata.bookCover
        }

        return res.status(201).send({ status: true, message: 'Success', data: resBookData});
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};


const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, msg: "bookId is not valid" }) }
        let bookData = req.body;
        let { title, excerpt, releasedAt, ISBN } = bookData;

        //-----------------check body is empty or not-----------------------------------------------------------
        if (Object.keys(bookData).length == 0)
            return res.status(400).send({ status: false, msg: "plss put some data in body" });

        let newtitle = await bookModel.findOne({ title });
        if (newtitle) return res.status(400).send({ status: false, msg: "title is already present" });

        let newISBN = await bookModel.findOne({ ISBN });
        if (newISBN) return res.status(400).send({ status: false, msg: "ISBN is already present" });

        //--------------CHECKING BOOK IS ALREADY DELETED OR NOT-------------------------------------
        const book = await bookModel.findById(bookId);
        if (book.isDeleted == true)
            return res.status(400).send({ status: false, msg: "Book is already deleted" });

        let updateBook = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            {
                $set: {
                    title: title, excerpt: excerpt,
                    releasedAt: new Date, ISBN: ISBN
                }
            },
            { new: true }
        );
        if (!updateBook) {
            return res.status(404).send({ status: false, message: "bookId not found" })
        }
        else {
            return res.status(200).send({ status: true, message: "book has been updated", data: updateBook })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.msg })
    }
}
//--------------------------------------------------------DELETEBOOKS---------------------------------//

const deletedBooks = async function (req, res) {
    try {
        let bookIdData = req.params.bookId;

        let book = await bookModel.findById(bookIdData);


        if (book.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No book exists" });
        }
        let deletedBooks = await bookModel.findByIdAndUpdate({ _id: bookIdData },
            { isDeleted: true, deletedAt: new Date() }, { new: true });

        res.status(200).send({ status: true, message: "book has been deleted" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};



module.exports = { createBook, updateBook, deletedBooks };
