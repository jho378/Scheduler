const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const {
    Asset,
    Book,
    Coin,
    Key,
    Stock,
    User,
    Schedule,
    Workout,
    Bucketlist,
} = require('./models');
const { getHTML, parsing, encryptPassword, setAuth } = require('./utils');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/books', require('./routes/books'));
app.use('/schedules', require('./routes/schedules'));
app.use('/assets', require('./routes/assets'));
app.use('/workouts', require('./routes/workouts'));
app.use('/bucketlists', require('./routes/bucketlists'));

// app.get('/', async(req, res)=> {
//     // res.sendFile(__dirname + "\\public\\index.html");
//     // res.sendFile(path.join(__dirname, ))
//     fs.readFile(__dirname+"/public/index.html", (err, data) => {
//         if(err){
//             console.log('error occured at url \'/\'.');
//             res.status(404).send('Not Found');
//         } else{
//             console.log("Requesting url '/'.");
//             res.end(data);
//         }
//         console.log('terminal')
//     });
// })

app.get('/traveler', (req, res) => {
    fs.readFile(path.join(__dirname, "./public/html/traveler.html"), (err, data) => {
        if(err){
            console.log(err);
            console.log('error occured at path /traveler');
            res.status(400).send('Invalid uri');
        }   else{
            res.end(data);
        }
    })
})

app.get('/:month', async(req, res) => {
    fs.readFile(__dirname + "/public/index.html", (err, data) => {
        if(err){
            console.log('error occured at path /:month');
            res.status(400).send('Invalid Month');
        }   else{
            res.end(data);
        }
    })
})

app.listen(port, () => {
    console.log(`listening at port: ${port}`);
});

// C : post R : get U : put D : delete
