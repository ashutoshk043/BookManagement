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

const loginUser = async function (req, res) {
  try {
    let userName = req.body.emailId;
    let password = req.body.password;

    let user = await userModel.findOne({ emailId: userName, password: password })

    if (!user) {
      return res.status(400).send({ status: false, msg: "username or the password is not correct" })
    }

    //--------------------------------token creation-------------------------------------------------------//
    let payload = {
      userId: user._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      group: "project3",
      organisation: "group39"
    }

    let token = jwt.sign({ payload }, "project3-secret-key")

    res.setHeader("x-api-key", token)

    res.status(201).send({ status: true, data: token })
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
};

module.exports = { createUser, loginUser };

