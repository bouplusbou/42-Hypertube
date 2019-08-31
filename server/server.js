const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const server = require('http').createServer(app);

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser());
app.use('/api', router);

const port = 5000;
server.listen(port, () => `Server running on port ${port}`);