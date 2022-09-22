const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = require("../Models/bookModel");


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
    let tokenVerify = jwt.verify(Token, "project3-secret-key"); 
    let rUid = req.body.userId
    let vUid = tokenVerify.payload.userId
    if(rUid != vUid){
      return res.status(400).send({status:false, message: "You are not authorised for this task...."})
    }

   return next()
   
  } catch (err) {
    return res.status(500).send({status:false, msg: err.message });
  }
};




module.exports ={Authentication, Authorization}
