const moongose=require('mongoose')
const createPostShemea=moongose.Schema({
user:String,
user_id:String,
content:String,
image:String,
privacy:String,
hashtags:String,
likes:{type:Number,default:0},
timestamp:Date
})
const createpostmodel=moongose.model('createpost',createPostShemea)
module.exports=createpostmodel