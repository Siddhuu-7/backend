const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const userRequest = require('./routes/request.route');
const searchEngine = require('./routes/search.route');
const SeekAndSeeking = require('./routes/SeekAndSeekers.route');
const Goals = require('./routes/Goals.route');
const Message = require('./routes/Message.route');
const socketHandler = require('./routes/socket.route'); 

require('dotenv').config();

const app = express();
const http = require('http');
const server = http.createServer(app);

socketHandler(server);

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure all necessary methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  }));
  

app.use('/user', userRoutes);
app.use('', userRequest);
app.use('/', Goals);
app.use('', searchEngine);
app.use('', SeekAndSeeking);
app.use('', Message);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
