const mongoose = require('mongoose');
const {Schema} = mongoose;

const assetSchema = new Schema({
    name : String,
    ticker : String,
    sector : String,
    industry : String,
    // dateOfPurchase : {type : Date, default : Date.now},
    averagePrice : Number,
    // purchasePrice : Number,
    // currentPrice : Number,
    balance : Number,
    assetType : String,
    user : {type : Schema.Types.ObjectId, ref:'User'},
})

assetSchema.index({name:1, user:1}, {unique : true});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset; 


// done by now
// sector industry -> https://www.msci.com/our-solutions/indexes/gics