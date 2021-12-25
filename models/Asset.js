const mongoose = require('mongoose');
const {Schema} = mongoose;

const assetSchema = new Schema({
    name : String,
    ticker : String,
    sector : String,
    industry : String,
    dateOfPurchase : {type : Date, default : Date.now},
    purchasePrice : Number,
    currentPrice : Number,
    balance : Number,
    user : {type : Schema.Types.ObjectId, ref:'user'},
    isDeleted : {type : Boolean, default : false},
})

assetSchema.index({name:1, user:1}, {unique : true});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset; 


// done by now
// sector industry -> https://www.msci.com/our-solutions/indexes/gics