const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    let data = req.body;

    let { title, name, phone, email, password } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please Enter Details" })
    }

    //----------title validation---------------------------//

    if (!title) { return res.status(400).send({ status: false, msg: "Title must be required !" }) }

    if (!/^Mr|Mrs|Miss+$/.test(title)) { return res.status(400).send({ status: false, msg: "Please Use Valid Title.like this: Mr/Mrs/Miss" }) }

    //------------name validation------------------------//

    if (!name) {
      return res.status(400).send({ status: false, msg: "name must be required !" })
    }

    if (!/^[A-Za-z]{1,35}/.test(name)) { return res.status(400).send({ status: false, msg: "name should start with Uppercase:- Name" }) }
    //------------mobile validation------------------------//
    let regphone = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    if (!regphone.test(phone)) {

      return res.status(400).send({ message: "Please enter valid Mobile Number" })
    }

    let phoneData = await userModel.findOne({ phone: phone })

    //Duplicate phone

    if (phoneData) return res.status(400).send({ status: false, msg: 'this mobile number is already exist' })

    //------------email validation------------------------//

    if (!email) {
      return res.status(400).send({ status: false, msg: "Email should be mandatory" })
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {

      return res.status(400).send({ status: false, msg: "please provide valid email" })
    }

    let emailVerify = await userModel.findOne({ email: email })

    if (emailVerify) {
      return res.status(400).send({ status: false, msg: "this email already exists please provide another email" })
    }

    //------------password validation------------------------//

    if (!password) {
      return res.status(400).send({ status: false, msg: "password must be required !" })
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,15}$/.test(password)) {

      return res.status(400).send({ status: false, msg: "password contain at least 8 chracter or less than 16 character" })
    }

    let savedata = await userModel.create(data)

    res.status(201).send({ status: true, msg: savedata });
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//=========================================loginAuthor=================================================//


  const login = async (req, res) => {
    try {
  
      let emailId = req.body.email
      let Password = req.body.password
  
      let userLogin = await userModel.findOne({ email: emailId, password: Password })
      if (!userLogin)
        return res.status(401).send({ status: false, msg: "invalid login details" })
  
  
      //-------------------------------😎token generation😎--------------------------------------------------------------------------------------------
      const newtoken = jwt.sign(
        {
          userId: userLogin._id,
          group: "39", iat: Math.floor(Date.now() / 1000) - 30
        }, "project3-secret-key",
        { expiresIn: "24h" });
  
      return res.status(200).send({ status: true, msg: "login succesfully", token: newtoken });
    } catch (err) {
      return res.status(500).send({ status: false, error: err.message });
    }
  }
  
module.exports = { createUser, login };

