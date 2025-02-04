const expres=require('express')
const route = expres.Router();
const { userModel: UserModel } = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const Request=require('../model/request.model')
const decode = (token) => {
  try {
    const data = jwt.decode(token);
    return data;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};


route.post('/login-google', async (req, res) => {
  const { token } = req.body; 
  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }
  const data = decode(token);
  if (!data) {
    return res.status(401).json({ error: "Invalid token." });
  }
  try {
    const email = data.email;
    const userName = data.name;  
    let user = await UserModel.findOne({ email }, { email: 1, userName: 1 });
    if (!user) {
      const newUser = new UserModel({ email, userName });
      user = await newUser.save(); 
    //   console.log("New user created:", user);
    } else {
      console.log("Existing user logged in:", user);
    }
    const userToken = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '1h', 
    });

    return res.status(200).json({
      message: "Login successful.",
      token: userToken,
      _id:user._id,
      userName:user.userName
    });
  } catch (error) {
    console.error("Error during Google login:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

route.post('/login-details',async(req,res)=>{
    const{MobileNumber,password}=req.body;
    try {
        let user = await UserModel.findOne({ MobileNumber });
        const ismatch= await bcrypt.compare(password,user.password)
        if(!ismatch){
            res.status(505).json('Password is not matched')
            return;
        }
        const userToken = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: '1h', 
          });
 return res.status(202).json({msg:'Login Succes',token:userToken,_id:user._id,userName:user.userName
 })
    } catch (error) {
        console.error("Error during  login:", error.message);
    return res.status(500).json({ error: "Internal server error." });
    }
})

route.post('/signup', async (req, res) => {
    let { userName, MobileNumber, email, password } = req.body;
    // Input validation
    // if (!userName || !MobileNumber || !email || !UnHasedPassword) {
    //     return res.status(400).json({ msg: "All fields are required" });
    // }

    try {
        password = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            userName,
            MobileNumber,
            email,
            password
        });

        const value=await newUser.save();

        res.status(201).json({ msg: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ msg: "Signup failed", error: error.message });
    }
});



route.get('/profileData/:id', async (req, res) => {
  const { id } = req.params;




  try {
    const data = await UserModel.findById(id,{password:0,MobileNumber:0});
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

route.post('/profileDataUpdate', async (req, res) => {
  try {
    const { id, profile } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

   
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: profile }, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(202).json({ msg: "Profile updated", data: updatedUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});




route.get('/get-all-data/:id', async (req, res) => {
  const id = req.params.id;
  
  try { 
    const acceptedRequests = await Request.find({
      $or: [{ requester: id }, { recipient: id }],
      status: "accepted"
    });
    const connectedUserIds = acceptedRequests.flatMap(req => [req.requester.toString(), req.recipient.toString()]);
    const data = await UserModel.find({}, { userName: 1, skills: 1, summary: 1 });
    const updatedData = data.map(user => ({
      ...user.toObject(),
      status: connectedUserIds.includes(user._id.toString()) ? "connected" : "not connected"
    }));
    res.status(202).json(updatedData);
  } catch (error) {
    console.error(error.message);
    res.status(505).json({ msg: error.message });
  }
});


module.exports = route;
