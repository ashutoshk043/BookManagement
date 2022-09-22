const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


//Authentication Part
const Authentication = async function (req, res, next) {
  try {
      let token = req.headers["x-api-key"]
      if (!token) return res.status(400).send({ status: false, message: "Token required" })

      jwt.verify(token, "project3-secret-key", (error, decodedToken) => {
          if (error) {
              return res.status(401).send({ status: false, message: "token is invalid" });

          }
          req["decodedToken"] = decodedToken    //this line for we can access this token outside the middleware

          // console.log(decodedToken )

          next()

      });

  } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
  }
}



const Authorization = async function (req, res, next) {
  try {
    let Token = req.headers["x-api-key"];
    if(!Token)
      return res.status(400).send({status:false, msg: "login is requred" });
    
    let tokenVerify = jwt.verify(Token, "project3-secret-key"); 
    req.headers.userId = tokenVerify.userId ;

    let checkuserId = await bookModel.findOne({_id:req.params.userId});
    if(!checkuserId){
      return res.status(403).send({status:false, msg: "userid is wrong"});
    }
    if(tokenVerify.userId !=checkbookId.userId){
      return res.status(403).send({status:false, msg: "not authorised"});
    }

   return next()
  } catch (err) {
    return res.status(500).send({status:false, msg: "Server Error 500" });
  }
};
module.exports ={Authentication, Authorization}