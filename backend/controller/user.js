const { where } = require('sequelize');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const secratekey=process.env.SECRATEKEY;

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
    
    bcrypt.hash(password,10,async(err,hash)=>{
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

const login=async (req,res)=>{
    try {
        const {password ,email}=req.body;
        if(isStringvalid(email)||isStringvalid(password)){
           return   res.status(400).json({message:'id or password are missing'})
        }
        const user= await User.findOne({where:{email:email}});
        if(!user){
           return  res.status(404).json({message:'User not authorized'});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const token=genrateToken(user.id, user.name) ;

        return res.status(200).json({ message: 'User logged in successfully', token: token});
        
    } catch (error) {
        console.error(error);
       return  res.status(500).json({message:'enternal server error',success:'failed'});
    }
}
const genrateToken=(id,name)=>{
    return jwt.sign({userId:id,name:name},secratekey)
}

function isStringvalid(data){
    return  !data || data.trim() === '';
}
module.exports={
    signup,login
}