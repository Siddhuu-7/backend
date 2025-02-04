const express = require("express");
const router = express.Router();
const { userModel: UserModel } = require("../model/user.model");
const Fuse = require("fuse.js");
const Request=require('../model/request.model')
router.get("/search-engine", async (req, res) => {
  try {
    const { query, userId } = req.query; 
    
    if (!query) {
      return res.status(400).json({ error: "❌ Query is required" });
    }

    const acceptedRequests = await Request.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted"
    });

    const connectedUserIds = acceptedRequests.flatMap(req => [req.requester.toString(), req.recipient.toString()]);

    const users = await UserModel.find({}, { userName: 1, skills: 1, summary: 1 });
    const fuse = new Fuse(users, {
      keys: ["userName", "skills"], 
      threshold: 0.3,
    });

    const fuseResults = fuse.search(query);

    const searchResults = fuseResults.length > 0 
      ? fuseResults.map(result => ({
          ...result.item.toObject(),
          status: connectedUserIds.includes(result.item._id.toString()) ? "connected" : "not connected"
      }))
      : [];

    if (searchResults.length === 0) {
      const searchCriteria = {
        $or: [
          { userName: { $regex: `.*${query}.*`, $options: "i" } },
          { skills: { $in: [query] } }
        ]
      };
      
      const results = await UserModel.find(searchCriteria, { userName: 1, skills: 1, summary: 1 });

      const updatedResults = results.map(user => ({
        ...user.toObject(),
        status: connectedUserIds.includes(user._id.toString()) ? "connected" : "not connected"
      }));

      res.json(updatedResults);
    } else {
      res.json(searchResults);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
