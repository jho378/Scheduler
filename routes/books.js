const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const {Book, User} = require('../models')

// creating a book history
router.post('/create', setAuth, async(req, res) => {
    const user = req.user;
    const {title, author, quote, genre, page, rating} = req.body;
    const book = new Book({
        title, author, quote, genre, page, user, rating, isDeleted : false
    });
    await book.save();
    return res.send(book);
})

// reading entire book history
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    try{
    const books = await Book.find({user, isDeleted : false});
    const bookstitle = books.map(e => e.title); 
    const booksAuthor = books.map(e => e.author);
    const booksQuote = books.map(e => e.quote);
    const booksjson = {bookstitle, booksAuthor, booksQuote};  
    return res.send(booksjson);
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating books.'});
    }
});


router.route('/:book')
    // getting a single book
    .get(setAuth, async(req, res) => {
        const user = req.user;
        const {bookTitle} = req.params;
        try{
            const book = await Book.findOne({user, title:bookTitle, isDeleted : false});
            const {title, author, quote, genre, page, rating} = book;
            return res.send({title, author, quote, genre, page, rating});
        } catch(err){
            return res.status(400).send({error : 'Error found when showing the book. Ask admin.'});
        }
    })
    // updating a single book
    .put(setAuth, async(req, res)=> {
        const user = req.user;
        const {bookTitle} = req.params;
        const {title, author, quote, genre, page, rating} = req.body;
        const _book = await Book.findOne({user, title:bookTitle, isDeleted : false});
        
        _book.title = title;
        _book.author = author;
        _book.quote = quote;
        _book.genre = genre;
        _book.page = page;
        _book.rating = rating;
        await _book.save();
        return res.send(_book);
    })
    // deleting a single book
    .delete(setAuth, async(req, res) =>{
        const user = req.user;
        const {bookTitle} = req.params;
        const _book = await Book.findOne({user, title : bookTitle, isDeleted : false});
        
        _book.isDeleted = true;
        await _book.save();
        return res.send(_book);
});

module.exports =router;

// Book done by now ; 