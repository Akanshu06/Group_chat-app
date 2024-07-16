const express= require('express');
const router= express.Router();
const controller=require('../controller/message');
const Authorization=require('../middleware/auth');

router.post('/usermessage',Authorization.authenticate,controller.message);
router.get('/getmessage',Authorization.authenticate,controller.getMessage);

module.exports=router;
