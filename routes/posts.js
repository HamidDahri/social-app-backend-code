const express  = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {check , validationResult} = require("express-validator")
const Post = require("../models/post")
const bcrypt = require("bcrypt");
const config = require("config");
const auth = require('../middleware/auth')

// @route post /api/posts
// @desc add post
// @access private

router.post('/',[auth ,
    [ check("body" , "Enter some text").not().isEmpty()
  ]]
    , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

    const newPost = new Post({
        user: req.user.id,
        body: req.body.body
    });

    try {
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
    }
})

// @route GET /api/posts
// @desc get all post
// @access private


router.get('/' , auth , async (req, res) => {
     try {
        const posts = await Post.find();
        res.status(200).json({posts: posts})
     } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
     }
})



// @route GET /api/posts/:userID
// @desc get a user posts
// @access private

router.get('/:userID' , auth , async (req, res) => {
    try {
       if(req.params.userID !== req.user.id) return res.status(401).json({msg:"Unauthorized User"}) 
       const posts = await Post.find({user :req.params.userID});
       res.status(200).json({posts: posts})
    } catch (error) {
       console.log(error.message);
       res.status(500).send("Server Error")
    }
})

// @route PUT /api/posts:postID
// @desc UPDATE A POST
// @access private

router.put('/:postID' , [auth, [
    check("body" , "Enter some text inside the body of post").not().isEmpty()
] ] , async (req, res) => {
      
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
    
    const changes = {};

    if(req.body.body) changes.body = req.body.body

    try {
       const post = await Post.findById(req.params.postID);
       if(!post) return res.status(400).json({msg: "Post does not exists"})
      
       if(post.user.toString() !== req.user.id) return res.status(401).json({msg:"Unauthorized User"}) 


     const  posts = await Post.findByIdAndUpdate(req.params.postID , {$set: changes},{new : true}) 

       res.status(200).json({posts: posts})
    } catch (error) {
       console.log(error.message);
       res.status(500).send("Server Error")
    }
})


// @route DELETE /api/posts:postID
// @desc DELETE A POST
// @access private
router.delete('/:postID' , auth , async (req, res) => {
      
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
    
    

    try {
       const post = await Post.findById(req.params.postID);
       if(!post) return res.status(400).json({msg: "Post does not exists"})
      
       if(post.user.toString() !== req.user.id) return res.status(401).json({msg:"Unauthorized User"}) 


     const  posts = await Post.findByIdAndDelete(req.params.postID) 

       res.status(200).json({posts: "POST deleted Succesfully"})
    } catch (error) {
       console.log(error.message);
       res.status(500).send("Server Error")
    }
})


module.exports= router