const mongoose = require('mongoose');
const Asset = require('./Asset');
const Book = require('./Book');
const Coin = require('./Coin');
const Key = require('./Key');
const Stock = require('./Stock');
const User = require('./User');
const Schedule = require('./Schedule');
const Workout = require('./Workout');

require('dotenv').config();

const mongoURL = `mongodb://admin:${process.env.DB_PASS}@calendar-shard-00-00.pfpok.mongodb.net:27017,calendar-shard-00-01.pfpok.mongodb.net:27017,calendar-shard-00-02.pfpok.mongodb.net:27017/calendarServer?ssl=true&replicaSet=atlas-nlsbae-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(mongoURL);
if(mongoose.connect(mongoURL))  console.log('connected to DB');


module.exports = {
    Asset,
    Book,
    Coin,
    Key,
    Stock,
    User,
    Schedule,
    Workout,
}
