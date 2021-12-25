const mongoose = require('mongoose');
const {Schema} = mongoose;

const bookSchema = new Schema({
    title : {type : String, required : true},
    author : String,
    quote : String,
    genre : String,
    page : Number, 
    rating : {type : Number, min:0, max:10},  
    user : {type : Schema.Types.ObjectId, ref : 'Book'}, 
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book; 


// done by now
