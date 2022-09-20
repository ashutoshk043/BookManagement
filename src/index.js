const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const {default:mongoose} = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://SudeepKumar874:cTbGUg6fWzq3zyfB@cluster0.ks18sd9.mongodb.net/group39Database-DB?retryWrites=true&w=majority.",
{
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected"))
.catch( err => console.log(err) )


  app.use('/', routes);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
