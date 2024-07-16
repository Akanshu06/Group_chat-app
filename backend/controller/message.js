const Massage=require('../models/message');
const message=async (req,res)=>{
    const {message}= req.body;
    try {
        const newMessage=await Massage.create({message});
        res.status(201).json({message:message})
    } catch (error) {
        console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
    }

}

module.exports={
    message
}