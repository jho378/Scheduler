const mongoose = require('mongoose');
const {Schema} = mongoose;
const scheduleSchema = new Schema({
    year : Number,
    month : Number,
    day : Number,
    description : String,
    user : {type: Schema.Types.ObjectId, ref :'user'},
    isDone : Boolean,
}) 

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
