const mongoose = require('mongoose');
const { Schema } = mongoose;

const bucketlistSchema = new Schema({
    title: String,
    description: String,
    isDone: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Bucketlist = mongoose.model('Bucketlist', bucketlistSchema);
module.exports = Bucketlist;

// done by now.
