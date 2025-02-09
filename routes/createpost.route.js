const express=require('express')
const router=express.Router()
const createpostmodel=require('../model/createpost.model')
router.post('/createpost', async (req, res) => {
    try {
      const { user, user_id, content, image, privacy, hashtags } = req.body;
  
      const newPost = new createpostmodel({
        user,
        user_id,
        content,
        image, 
        privacy,
        hashtags,
        timestamp: new Date(),
      });
  
      await newPost.save();
  
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  });
  router.get("/g",(req,res)=>{
    res.json({msg:"hi"})
  })
module.exports=router