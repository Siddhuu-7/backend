const express=require('express');
const userRoutes=require('./routes/user.routes')
const userResquest=require('./routes/request.route')
const cors=require('cors')
require('dotenv').config()
const app=express();
const bcrypt=require('bcrypt')
app.use(express.json())
const PORT=process.env.PORT
app.use(cors({
    origin:"*"
}))
app.use('/user',userRoutes)
app.use('',userResquest)
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})