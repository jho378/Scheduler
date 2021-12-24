const mongoose = require('mongoose');
const {Schema} = mongoose;

const assetSchema = new Schema({
    name : String,
    ticker : String,
    sector : String,
    industry : String,
    price : Number,
    balance : Number,
    user : {type : Schema.Types.ObjectId, ref:'user'},
})

assetSchema.index({name:1, user:1}, {unique : true});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset; 

// done by now
// sector industry -> https://www.msci.com/our-solutions/indexes/gics