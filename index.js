const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/dbConfig');
const Users = require('./models/userModel');
const serverConfig = require('./config/serverConfig')

const app = express();
mongoose.connect(dbConfig.MONGODB_URL)
    .then(data => console.log('MONGO DB IS CONNECTED.'))
    .catch(err => console.log(`Error while connecting to MONGO DB: ${err}`));
//const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/login', (req, res) => {
    const reqBody = req.body
    console.log(reqBody);

    const foundUser = Users.findOne(reqBody, (err, data) => {
        console.log(data);
        if (err) {
            const errorMsg = `Error on getting user from DB: ${err}`;
            console.log(errorMsg);
            res.send(errorMsg);
            return;
        }

        //wat 1
        // if (data)
        //     res.send(data);

        // else {
        //     res.send('User not found');
        // }

        //way 2
        // res.send(data ? data : 'User not found.');

        //way 3
        res.send(data || 'User not found.');
    });
}); 


app.post('/api/register', (req, res) => {
    const reqBody = req.body;
    // console.log('reg user data', reqBody);
    Users.findOne(reqBody, async (err, data) => {
        console.log(data);
        if (err) {
            const errorMsg = `Error on getting user from DB: ${err}`;
            console.log(errorMsg);
            res.send(errorMsg);
            return;
        }


        if (data)
            res.send(`user already exists: ${data.username}`);

        else {
            const newUser = new Users(reqBody);
            const saveNewUser = await newUser.save();
            console.log(saveNewUser);
            res.send(saveNewUser || 'User not registered')
        }
    });

});

app.listen(serverConfig.port, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(serverConfig.serverRunningMsg);
    }
});