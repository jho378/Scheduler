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
workoutSchema.index({name :1, user:1}, {unique:true})

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;

// done by now