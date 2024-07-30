const express = require('express');
const router = express.Router();
const control = require('../controller/group');
const Authorization=require('../middleware/auth');

router.post('/createGroup',Authorization.authenticate,control.createGroup);
router.get('/getAllGroup',Authorization.authenticate,control.getAllGroup);


module.exports=router;
