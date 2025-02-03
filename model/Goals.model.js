const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
    assignedBy: {
        name: { type: String, required: true },
        _id: { type: String, required: true }
    },
    assignedTo: {
        type: String,
        required: true
    },
    assignedGoal: [{
        goals: { type: String, required: true },
        complete: { type: String, default: "pending" } // Default value set correctly
    }]
});

module.exports = mongoose.model('Goals', yourSchema);
