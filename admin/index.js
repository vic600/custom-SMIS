const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const config = require('./config/database');
const router = express.Router();
const authadmin = require('./routes/authadmin')(router);

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('failed to connect to db' + err);
    } else {
        console.log('connected to db' + config.db);
    }
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use('/authadmin', authadmin);
app.use(express.static(__dirname + '/client/dist/'));
app.get('**', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(port, (err) => {
    if (err) {
        console.log('connection failed' + err);
    } else {
        console.log('connected to server on port' + port);
    }
});