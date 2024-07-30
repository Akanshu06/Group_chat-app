const Group = require('../models/Group');
const User = require('../models/user');
const { message } = require('./message');
const sequelize = require('../database/sequelize');
const { where } = require('sequelize');


const createGroup = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const userId = req.user.id;

        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required.' });
        }

        const creategroup = await Group.create({ groupName: groupName,createdBy:req.user.id }, { transaction });

        if (!creategroup) {
            await transaction.rollback();
            return res.status(500).json({ message: 'Failed to create group.' });
        }

        await creategroup.addUser(userId, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Group created and user added.', createGroup });
    } catch (error) {
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError);
        }
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


const getAllGroup = async (req, res) => {
    try {
        const userID = req.user.id; 
        const groups = await Group.findAll({
            include: [
                {
                    model: User,
                    through: { attributes: [] }, // Exclude join table attributes
                    where: { id: userID }
                }
            ]
        });

        if (groups.length > 0) {
            res.status(200).json({ groups, message: 'Groups retrieved successfully' });
        } else {
            res.status(404).json({ message: 'No groups found for this user' });
        }
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports={
    createGroup,getAllGroup
}