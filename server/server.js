const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const server = require('http').createServer(app);
const passport = require("passport");

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser());
app.use('/api', router);



async function connectMongo() {
    const mongoURI = require("./config/keys").mongoURI;
    const mongoose = require("mongoose");
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log("MongoDB successfully connected");
    } catch(err) { console.log(err); }
}
connectMongo();

app.use(passport.initialize());
require("./config/passport")(passport);


const port = 5000;
server.listen(port, () => `Server running on port ${port}`);