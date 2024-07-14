const express = require('express');
const sequelize=require('./backend/database/sequelize')
const cors = require('cors');
const dotenv=require('dotenv').config();
const path=require('path');
const app = express();


const userRoutes= require('./backend/routes/user')

app.use(cors({
  origin:'*',
  methods:['GET','POST']
}));
app.use(express.json())
app.use('/user',userRoutes);

app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,`frontend/${req.url}`));
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