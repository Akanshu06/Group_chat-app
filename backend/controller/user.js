const { where } = require('sequelize');
const User=require('../models/user');
const bcrypt=require('bcrypt');

const signup=async (req,res)=>{
    //console.log('reached====################');
   try {
    const {name,phone,password,email}=req.body;

    if(isStringvalid(name)||isStringvalid(password)||isStringvalid(email)||isStringvalid(phone)){
        return res.status(400).json({ message: 'Name, email, and password are required fields' });
    }
    const existingUser=await User.findOne({where:{email:email}});
    if(existingUser){
        res.status(200).json({message:'User already exist'})
    }
    const saltRound=10;
    bcrypt.hash(password,saltRound,async(err,hash)=>{
        await User.create({name,phone,email,password:hash});
        res.status(201).json({message:'new user signup successfully'});
        if(err){
            console.error(err);
        }
    })
   } catch (error) {
    console.error(error);
    res.status(500).json({message:'enternal server error'});
   }
}

function isStringvalid(data){
    return  !data || data.trim() === '';
}
module.exports={
    signup,
}