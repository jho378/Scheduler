const mongoose = require('mongoose');
const {Schema} = mongoose;
const scheduleSchema = new Schema({
    date : { type : Date, default : Date.now },
    title : String,
    description : String,
    user : {type: Schema.Types.ObjectId, ref :'user'},
    id : Number,
    isDone : {type : Boolean, default : false},
    isDeleted : {type : Boolean, default : false},
}) 


const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
