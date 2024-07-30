const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize');

const Group = sequelize.define('Group',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:DataTypes.STRING,
    createdBy:DataTypes.STRING,

});


module.exports=Group;