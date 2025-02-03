const express = require('express'); 
const route = express.Router();
const Request = require('../model/request.model'); 
const mongoose=require('mongoose')
const { userModel: UserModel } = require('../model/user.model');
route.post('/request', async (req, res) => {
    const { requester, recipient, status } = req.body;

    try {
        if (!requester || !recipient || !status) {
            return res.status(400).json({ msg: "requester, recipient, and status are required" });
        }

        const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: `Invalid status value. Valid options are: ${validStatuses.join(', ')}` });
        }

        const existingRequest = await Request.findOne({ requester, recipient });

        if (existingRequest) {
            existingRequest.status = status;
            existingRequest.updatedAt = Date.now();
            await existingRequest.save(); 

            return res.status(200).json({ msg: "Request updated successfully", request: existingRequest });
        } else {
            const newRequest = new Request({
                requester,
                recipient,
                status,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await newRequest.save(); 

            return res.status(201).json({ msg: "Request created successfully", request: newRequest });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: error.message });
    }
});


route.get('/get-all-requests/:id', async (req, res) => {
    const recipient = req.params.id;  
    try {
        const requestData = await Request.find({ recipient: recipient });

        const pendingRequests = requestData.filter(request => request.status === 'pending');
        if (pendingRequests.length > 0) {
            const usersData = await Promise.all(pendingRequests.map(async (request) => {
                const requesterObjectId = new mongoose.Types.ObjectId(request.requester);
                const requesterData = await UserModel.findById(requesterObjectId, {
                    password: 0,
                    MobileNumber: 0,
                    email: 0,
                    location: 0,
                    experience: 0,
                    professionalCategory: 0
                });

                return requesterData;  
            }));

            res.json(usersData);  
        } else {
            res.status(404).json({ msg: "No pending requests found for this recipient." });
        }
    } catch (error) {
        res.status(505).json({ msg: error.message });
        console.log(error.message);
    }
});


route.get('/get-accepted-request/:id', async (req, res) => {
    const id = req.params.id;


    try {
        const accepteddata = await Request.find({ 
            $or: [
                { recipient: id, status: "accepted" },
                { requester: id, status: "accepted" }
            ]
        });

        console.log(accepteddata);

        if (accepteddata.length === 0) {
            return res.json([]);
        }

        
        const userIds = accepteddata.map(data => 
            data.requester === id ? data.recipient : data.requester
        );

        const userData = await UserModel.find({ _id: { $in: userIds } }, { userName: 1 });

        res.json(userData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});







module.exports = route;

 