const express  = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {check , validationResult} = require("express-validator")
const User = require('../models/users')
const bcrypt = require("bcrypt");
const config = require("config")

router.post('/',[
    check('name' , "Please provide a Name").not().isEmpty().isLength({min: 4}),
    check("email" , "Please Provide a EMAIL").isEmail(),
    check("password", "Enter password between 5 - 20 characters").not().isEmpty().isLength({min: 5 , max: 20})
] , async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
      
      const {name , email, password} = req.body;

      const user = new User({
           name , email , password
      })

       const salt = await bcrypt.genSalt(5);
       user.password = await bcrypt.hash(password ,salt);
       
       const checkUser = await User.findOne({email}).select();

       if(checkUser) return res.status(400).json({msg: "User Already Exists"})
      
      try {

          await user.save();
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
  
      } catch (err) {
        console.log("Error", err.message);
        res.status(500).json({msg: "Server Error "})
      }
})

module.exports= router