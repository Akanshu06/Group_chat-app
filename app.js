const express = require('express');
const sequelize=require('./backend/database/sequelize')
const cors = require('cors');
const dotenv=require('dotenv').config();
const path=require('path');
const app = express();

const User=require('./backend/models/user');
const Message=require('./backend/models/message');
const userRoutes= require('./backend/routes/user');
const messageRoutes=require('./backend/routes/message');

app.use(cors({
  origin:'*',
  methods:['GET','POST']
}));
app.use(express.json())
app.use('/user',userRoutes);
app.use('/message',messageRoutes);
app.use(express.static(path.join(__dirname, 'frontend')));

//association
User.hasMany(Message);
Message.belongsTo(User);


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