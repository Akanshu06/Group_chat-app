const Sequelize= require('sequelize');

const sequelize= new Sequelize('group-chat-app','root','mysql',{
    host:'localhost',
    dialect:'mysql'
});

module.exports=sequelize;