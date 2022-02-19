const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    id: { type: String, unique: true },
    lastname : String,
    firstname : String,
    birthday : Date,
    created : { type: Date, default: Date.now },
    refreshToken : String,
    password: String,
    keys: [{ type: Schema.Types.ObjectId, ref: 'Key' }],
    assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
    schedules: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }],
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    isDeleted: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

// done by now
