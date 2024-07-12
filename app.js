const express = require('express');
const sequelize=require('./backend/database/sequelize')
const cors = require('cors');
const dotenv=require('dotenv').config();
const app = express();

const userRoutes= require('./backend/routes/user')

app.use(cors());
app.use(express.json())
app.use('/user',userRoutes);

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