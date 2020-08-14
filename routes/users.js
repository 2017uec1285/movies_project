const auth=require('../middleware/auth');
//const config=require('config');
//const jwt=require("jsonwebtoken");
const _ =require('lodash');
const bcrypt=require('bcrypt');
const {User,validUser}=require("../model/user");
const express = require("express");
const router = express.Router();

router.get('/me',auth,async (req,res)=>{
    const user=await User.findById(req.user._id).select('-password');
    res.send(user);
  });
router.post("/", async (req, res) => {
  const {error}=validUser(req.body);
  if(error)return res.status(400).send(error.details[0].message);

  let user =await User.findOne({email:req.body.email});
  if(user)return res.status(400).send('This email is already register');
  user=new User(_.pick(req.body,["name","email","password"]));
  const salt=await bcrypt.genSalt(10);
  user.password=await bcrypt.hash(user.password,salt);
  await user.save();
  const token=user.generateAuthToken();
  //console.log(user,token);
  res.header('x-auth-token',token)
  .header('access-control-expose-headers','x-auth-token')
  .send(_.pick(user,['_id','name','email']));
});

module.exports = router;
