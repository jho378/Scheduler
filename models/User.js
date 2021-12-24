const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name : String,
    id : {type : String, unique : true},
    password : String,
    keys : [{type : Schema.Types.ObjectId, ref : 'Key'}],
    assets : [{type : Schema.Types.ObjectId, ref : 'Asset'}],
    books : [{type : Schema.Types.ObjectId, ref : 'Book'}],
})

const User = mongoose.model('User', userSchema);
module.exports = User;

// done by now