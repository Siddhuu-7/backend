const express=require('express')
const Router=express.Router()
const Message=require('../model/messages.model')
Router.get('/get/messages', async (req, res) => {
    try {
      const { senderId, receiverId } = req.query; 
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'senderId and receiverId are required' });
      }
  
      const roomId = [senderId, receiverId].sort().join("_"); 
      const messages = await Message.find({ roomId });
  
      res.json(messages); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
  });
  module.exports=Router
