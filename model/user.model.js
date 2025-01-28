const mongoose=require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.mongooseString)
.then(()=>console.log('Database connected'))
.catch(err=>console.error(err))


const SignUpSchema = new mongoose.Schema({
    userName: { type: String, default: "Anonymous" }, 
    MobileNumber: { type: String, unique: true },
    email: { type: String, default: "user@example.com" },
    password: { type: String },
    professionalCategory: { type: String, default: "General" }, 
    location: { type: String, default: "Unknown" },
    summary: { type: String, default: "No summary available" }, 
    skills: { type: [String], default: [] } ,
    experience: [
        {
            company: { type: String, default: "N/A" },
            title: { type: String, default: "N/A" },
            
        }
    ],
    
});


const User = mongoose.model('User', SignUpSchema);

module.exports = User;
const userModel= new mongoose.model('userModel',SignUpSchema)
module.exports={userModel}