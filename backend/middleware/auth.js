const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports.authenticate = async(req,res,next)=>{
    try {
     const token = req.header('Authorization');
     //console.log(token);
     const user = jwt.verify(token, process.env.SECRATEKEY);
     const foundUser = await User.findByPk(user.userId); // Fetch user from database
    // console.log('founduser==>',foundUser);
     if (!foundUser) {
        return res.status(404).json({ success: false, error: 'User not found' });
     }
      req.user=foundUser;
      next();
 
    } catch (error) {
     return res.status(400).json({success:false});
    }
    
 }