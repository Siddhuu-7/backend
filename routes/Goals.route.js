const express = require('express');
const router = express.Router();
const Goals = require('../model/Goals.model');


router.post('/goals/post', async (req, res) => {
    try {
        const { assignedBy, assignedTo, assignedGoal } = req.body;

        let newGoal;

        if (typeof assignedGoal === "string") {
            newGoal = { goals: assignedGoal, complete: "pending" };
        } else {
            newGoal = assignedGoal; 
        }

        let existingGoal = await Goals.findOne({ assignedBy, assignedTo });

        if (existingGoal) {
            existingGoal.assignedGoal.push(newGoal); 
            await existingGoal.save();
            res.status(200).json({ message: "Goal updated successfully!", goal: existingGoal });
        } else {
            const newGoalEntry = new Goals({
                assignedBy,
                assignedTo,
                assignedGoal: [newGoal]  
            });
            await newGoalEntry.save();
            res.status(201).json({ message: "Goal assigned successfully!", goal: newGoalEntry });
        }
    } catch (error) {
        res.status(500).json({ message: "Error saving goal", error: error.message });
    }
});
router.put('/update/goal', async (req, res) => {
    try {
        const { assignedTo, taskId } = req.body;

        const goal = await Goals.findOne({ assignedTo });

        if (!goal) {
            return res.status(404).json({ message: "Goal not found!" });
        }

        const updatedGoal = await Goals.findOneAndUpdate(
            { assignedTo, "assignedGoal._id": taskId },
            { $set: { "assignedGoal.$.complete": "completed" } },
            { new: true }
        );

        res.status(200).json({ message: "Task marked as completed", updatedGoal });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});


router.get('/fetch/goals/:id',async(req,res)=>{
    const id=req.params.id;
    try {
        const goals=await Goals.find({assignedTo:id})
        if(!goals){
           return res.json({msg:"no Goals Found"})
        }
        res.json(goals)
    } catch (error) {
        res.json({msg:error.message})
    }
})



router.delete('/goals/delete/:Id', async (req, res) => {
  const { Id } = req.params;  

  try {
    const result = await Goals.updateOne(
      { 'assignedGoal._id': Id }, 
      { $pull: { assignedGoal: { _id: Id } } } 
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Goal deleted successfully' });
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the goal' });
  }
});

module.exports = router;

module.exports = router;
