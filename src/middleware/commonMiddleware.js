
const auth = async function (req, res, next) {
    try {
        let Query = req.query

        if (Object.keys(Query).length !== 0) {

            const Blog = await BlogsModel.findOne({ authorId: req.token.payload.authorId, ...Query })
            if (!Blog) {
                return res.status(404).send({ status: false, message: "blog are not found" })
            }

            if (Blog.authorId.toString() !== req.token.payload.authorId) {
                return res.status(400).send({ status: false, message: "you are not authorised" });
            }

            return next()
        }



        //------------------------------------------- AuthorisationByparam-----------------------------------------------//


        let BlogId = req.params.blogId;

        const IsBlog = await BlogsModel.findOne({ _id: BlogId, isDeleted: false })
        if (!IsBlog) {
            return res.status(404).send({ status: false, message: "blog are not found" })
        }

        if (IsBlog.authorId.toString() !== req.token.payload.authorId) {

            return res.status(400).send({ status: false, message: "you have not access for authorization" });
        }

        next()

    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }

}