const Sequelize= require('sequelize');

const sequelize= new Sequelize('chat','root','mysql',{
    host:'localhost',
    dialect:'mysql'
});

module.exports=sequelize;