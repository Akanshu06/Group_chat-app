const { where } = require('sequelize');
const User=require('../models/user');
const Group = require('../models/Group');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {Op}=require('sequelize')

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

const getUsersNotInGroup = async (req, res) => {
    const groupId = req.query.groupId; // Use query parameters for GET requests

    if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required' });
    }

    try {
        //const usersNotInGroup = await User.findAll();
        //Get all users who are not in the specified group
        const usersInGroup = await User.findAll({
            attributes: ['id'],
            include: {
                model: Group,
                where: { id: groupId },
                attributes: []
            }
        });
        console.log('cdnjksncjsnvlsvm',usersInGroup);
        const usersInGroupIds = usersInGroup.map(user => user.id);
        const usersNotInGroup = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: usersInGroupIds
                }
            }
        });
        if (usersNotInGroup.length > 0) {
            return res.status(200).json({ users: usersNotInGroup });
        } else {
            return res.status(404).json({ message: 'No users found who are not in this group' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const genrateToken=(id,name)=>{
    return jwt.sign({userId:id,name:name},secratekey)
};

function isStringvalid(data){
    return  !data || data.trim() === '';
};

const addUserToGroup =  async (req,res)=>{
    const { userId, groupId } = req.body;
    try {
        // Find the user and group
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).send('User or Group not found');
        }
        // Add the user to the group
        await user.addGroup(group); 
        res.status(200).send('User added to group');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports={
    signup,login,getUsersNotInGroup,addUserToGroup
};