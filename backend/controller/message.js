const Massage=require('../models/message');
const message=async (req,res)=>{
    const {message}= req.body;
   // console.log('============'+req.user.id);
    try {
        const newMessage=await Massage.create({message,UserId:req.user.id});
        res.status(201).json({message:message})
    } catch (error) {
        console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
    }

}

const getMessage=async (req,res)=>{
    const userId=req.user.id;
    try {
        const messages=await Massage.findAll({userId:userId});
        //console.log(messages);
        res.status(200).json({messages:messages});
        
    } catch (error) {
        res.status(500).json({message:'enternal server error'});
    }
}

module.exports={
    message,getMessage
}