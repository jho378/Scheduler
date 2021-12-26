const mongoose = require('mongoose');
const {Schema} = mongoose;

const coinSchema = new Schema({
    name : {type:String, unique:true},
    sector : String,
    industry : String,
    assetType : String,
    isActive : Boolean,
})

const Coin = mongoose.model('Coin', coinSchema);
module.exports = Coin;


// done by now.