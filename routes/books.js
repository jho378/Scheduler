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
    return res.send({book});
})

// reading entire book history
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    try{
    const books = await Book.find({user, isDeleted : false});
    const bookstitle = books.map(e => e.title); 
    const booksAuthor = books.map(e => e.author);
    const booksQuote = books.map(e => e.quote);
    const bookPage = books.map(e => e.page);
    const booksjson = {bookstitle, booksAuthor, booksQuote, bookPage};  
    return res.send({booksjson});
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating books.'});
    }
});


router.route('/:bookTitle')
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
        const book = await Book.findOne({user, title:bookTitle, isDeleted : false});
        
        book.title = title;
        book.author = author;
        book.quote = quote;
        book.genre = genre;
        book.page = page;
        book.rating = rating;
        await book.save();
        return res.send({book});
    })
    // deleting a single book
    .delete(setAuth, async(req, res) =>{
        const user = req.user;
        const {bookTitle} = req.params;
        const book = await Book.findOne({user, title : bookTitle, isDeleted : false});
        if(!book)   return res.status(404).send({error : `The book ${bookTitle} not found.`})
        book.isDeleted = true;
        await book.save();
        return res.send({book});
});

module.exports =router;

// Book done by now ; 