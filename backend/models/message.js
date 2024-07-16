const DataTypes=require('sequelize');
const Sequelize = require('../database/sequelize');

const Message=Sequelize.define('message',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false // assuming messages cannot be empty
      }
}) ;
module.exports=Message;