const express =require('express');
const router = express.Router();

const userControl= require('../controller/user');

router.post('/signup',userControl.signup);
router.post('/login',userControl.login);
router.get('/getUsersNotInGroup',userControl.getUsersNotInGroup);
router.post('/addtogroup',userControl.addUserToGroup);


module.exports=router;