const Message=require('../models/message');
const User = require('../models/user');
const Group= require('../models/Group');
const {Op}=require('sequelize');

const sendMessage = async (req, res) => {
    const { groupId, message } = req.body;

    try {
        // Check if the user is part of the group
        const user = await User.findByPk(req.user.id);
        const group = await Group.findByPk(groupId);
        
        if (!user || !group) {
            return res.status(404).json({ error: 'User or Group not found' });
        }

        const isMember = await group.hasUser(user);
        if (!isMember) {
            return res.status(403).json({ error: 'You are not a member of this group' });
        }

        const newMessage = await Message.create({
            message,
            UserId:user.id,
            GroupId: groupId
        });
        
        res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
};

const getMessage = async (req, res) => {
    const groupId=req.query.groupId
    let lastMsgId = req.query.lastMsgId || -1;
    //console.log(groupId,lastMsgId,req.user.id);

    try {
        const user = await User.findByPk(req.user.id);
        const group = await Group.findByPk(groupId);

        if (!user || !group) {
            return res.status(404).json({ error: 'User or Group not found' });
        }

        const isMember = await group.hasUser(user);
        if (!isMember) {
            return res.status(403).json({ error: 'You are not a member of this group' });
        }

        const messages = await Message.findAll({
            where: {
                GroupId:groupId,
                id: {
                    [Op.gt]: lastMsgId
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ],
            order: [['id', 'ASC']]
        });
        //console.log('jujuju8juju8',messages);
        res.status(200).json({ messages: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports={
    sendMessage,getMessage
}