const express = require("express");
const router = express.Router();
const { userModel: UserModel } = require("../model/user.model");
const Fuse = require("fuse.js");

router.get("/search-engine", async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "❌ Query is required" });
    }

    const users = await UserModel.find({}, { userName: 1, skills: 1, summary: 1 });

    const fuse = new Fuse(users, {
      keys: ["userName", "skills"], 
      threshold: 0.3,
    });

    const fuseResults = fuse.search(query);

    if (fuseResults.length > 0) {
      res.json(fuseResults.map(result => result.item));
    } else {
      const searchCriteria = {
        $or: [
          { userName: { $regex: `.*${query}.*`, $options: "i" } },
          { skills: { $in: [query] } }
        ]
      };
      
      const results = await UserModel.find(searchCriteria, { userName: 1, skills: 1, summary: 1 });
      res.json(results);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
