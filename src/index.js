const express = require("express");
const app = express();
const multer = require('multer')
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const routes = require("./routes/route.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any())


mongoose
  .connect(
    "mongodb+srv://SudeepKumar874:cTbGUg6fWzq3zyfB@cluster0.ks18sd9.mongodb.net/group39Database-DB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", routes);


app.use("/*", function (req, res) {
  res
    .status(400)
    .send({
      status: false,
      message: "Please Enter Valid Path Or Parameters !!!!",
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
