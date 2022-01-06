const mongoose = require('mongoose');
const {Schema} = mongoose;

const workoutSchema = new Schema({
    name : String,
    part : String,
    weight : Number,
    set : Number,
    rep : Number,
    id : Number,
    date : { type : Date, default : Date.now },
    user : {type : Schema.Types.ObjectId, ref : 'User'},
})

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;

// done by now