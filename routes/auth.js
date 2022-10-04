const express  = require("express");
const router = express.Router();
const {check , validationResult} = require('express-validator');
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt  = require("jsonwebtoken")
const config = require('config');
const auth = require('../middleware/auth')



router.get('/' ,auth , async (req, res) => {
    try {
         const user = await User.findById(req.user.id).select('-password')
         res.json(user)
    } catch (error) {
        console.log(error.message);
        res.send(500).send("Server Error")
    }
})





router.post('/',[
   check("email" ,"Please Provide a valid Email").isEmail(),
   check("password" , "Please Enter a valid Password").not().isEmpty().isLength({min: 5 , max: 20})
], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const {email , password} = req.body;

   try {

    const user = await User.findOne({email}); 
    if(!user) return res.status(400).json({msg: "User with this email does not Exist"});

    const isMatched = await bcrypt.compare(password , user.password);
    if(!isMatched) return res.status(400).json({msg: "Incorrect Password"});
    
    const payload = {
        user: {
           id: user.id
        }
  }
     jwt.sign(payload , config.get("jwtSecret"), {
        expiresIn: 1000000
     }, (err , token) => {
      if(err) throw err;
      res.status(200).json({token: token})
     })


   } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Server Error"})
   }
});

module.exports= router