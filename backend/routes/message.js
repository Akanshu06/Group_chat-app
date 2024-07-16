const express= require('express');
const router= express.Router();
const controller=require('../controller/message');

router.post('/usermessage',controller.message);

module.exports=router;
