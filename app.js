const express = require('express');
const sequelize=require('./backend/database/sequelize')
const cors = require('cors');
const dotenv=require('dotenv').config();
const path=require('path');
const app = express();

const User=require('./backend/models/user');
const Message=require('./backend/models/message');
const Group = require('./backend/models/Group');

const userRoutes= require('./backend/routes/user');
const messageRoutes=require('./backend/routes/message');
const groupRoutes = require('./backend/routes/group');
app.use(cors({
  origin:'*',
  methods:['GET','POST']
}));
app.use(express.json())
app.use('/user',userRoutes);
app.use('/message',messageRoutes);
app.use('/group',groupRoutes);


app.use(express.static(path.join(__dirname, 'frontend')));

//association
User.hasMany(Message);
Message.belongsTo(User);
User.belongsToMany(Group,{through:'usergroup'});
Group.belongsToMany(User,{through:'usergroup'});
Group.hasMany(Message, {
  foreignKey: 'GroupId',
  onDelete: 'CASCADE',
});
Message.belongsTo(Group, {
  foreignKey: 'GroupId',
})



const port=process.env.PORT||3000;
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });