const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')


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



module.exports = router
