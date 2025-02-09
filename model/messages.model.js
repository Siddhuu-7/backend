const moongoose=require('mongoose');
const MessageSchema = new moongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    roomId:{type:String,default:" "},
    timestamp: { type: Date, default: Date.now },
  });
const MsgModel=moongoose.model('Messages',MessageSchema)
module.exports=MsgModel;