const express= require('express');
const router= express.Router();
const controller=require('../controller/message');
const Authorization=require('../middleware/auth');

router.post('/groupmessage',Authorization.authenticate,controller.sendMessage);
router.get('/getmessage',Authorization.authenticate,controller.getMessage);

module.exports=router;
