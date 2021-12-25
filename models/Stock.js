const mongoose = require('mongoose');
const {Schema} = mongoose;

const stockSchema = new Schema({
    name : {type:String, unique:true},
    ticker : String,
    sector : String,
    industry : String,
    isActive : Boolean,
})


const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;

// done by now.