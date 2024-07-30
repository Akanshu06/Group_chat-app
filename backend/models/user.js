const {DataTypes}=require('sequelize');
const sequelize= require('../database/sequelize');

const User=sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement:true
    },
    name:DataTypes.STRING,
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    phone:DataTypes.STRING,
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports=User;