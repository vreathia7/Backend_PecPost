const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("hello user")
// })

router.post('/signup',(req,res)=>{
    const {firstName,lastName,email,password,username} = req.body
    if(!email || !password || !firstName || !username)
    {
        
        return res.status(422).json({error:"please add all field"})
    }
    if (password.length<6)
     {
         
        return res.status(422).json({error:"invalid pass"})
     }
     if(username.length<5 || username.length>30)
     {
        return res.status(422).json({error:"Invalid usename"})
     }
   
    User.findOne({$or : [{email:email} , {username:username}],})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exist with that email or username"})
        }
        bcrypt.hash(password,13)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                username,
                firstName,
                lastName
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved sucessfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {username,password} = req.body
    if(!username || !password){
        res.status(422).json({error:"please add Username or Password"})
    }
    User.findOne({username:username})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Username or Password"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"sucessfully signed in"})
                const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
                const {_id,firstName,lastName,username,email} = savedUser
                res.json({token,user:{_id,firstName,lastName,username,email}})
            }
            else{
                return res.status(422).json({error:"Invalid Username or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})



module.exports = router
