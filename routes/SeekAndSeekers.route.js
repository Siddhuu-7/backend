const express = require("express");
const router = express.Router();
const SeekAndSeking =require('../model/SeekAndSekin.model')
const { userModel: UserModel } = require('../model/user.model');
router.post('/seekAndSeeking',async(req,res)=>{
    const {seeking,seeker,role}=req.body
    try{
        const data=new SeekAndSeking({
            seeker:seeker,
            seeking:seeking,
            role:role,
            status:"pending"
        })
        await  data.save()
        res.status(202).json({msg:"ok"})
    }catch(err){
        res.json(err.message)
    }
})
router.get('/seekAndSeeking/handelSeeking/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await SeekAndSeking.find({ seeking: id ,status:"accepted"});
        const users = await Promise.all(
            data.map(async (entry) => {
                const user = await UserModel.findById(entry.seeker,{password:0,email:0,MobileNumber:0}); 
                return {seekeingData: user } ;
            })
        );
        res.json(users); 
    } catch (err) {
        res.json({ msg: err.message });
    }
});
router.get('/seekAndSeeking/handelSeeker/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await SeekAndSeking.find({ seeker: id ,status:{ $in: ["pending", "accepted"] }});
        const users = await Promise.all(
            data.map(async (entry) => {
                
                const user = await UserModel.findById(entry.seeking,{password:0,email:0,MobileNumber:0}); 
                return {seekeingData: user, request:entry.status } ;
            })
        );
        res.json(users); 
    } catch (err) {
        res.json({ msg: err.message });
    }
});
router.put('/seekAndSeeking/acceptRequest/:id/:Id', async (req, res) => {
    const { id, Id } = req.params;  
    console.log('Received IDs:', id, Id);  

    try {
        const request = await SeekAndSeking.findOne({ seeker: Id, seeking: id }); 
        console.log(request); 

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        request.status = 'accepted';
        await request.save();

        res.json(request);
    } catch (err) {
        console.error('Error accepting the seeker:', err.message);
        res.status(500).json({ msg: err.message });
    }
});

  

module.exports=router
