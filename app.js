const express = require('express');
const {body, validationResult} = require('express-validator');
const crypto = require('crypto');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const {Asset, Book, Coin, Key, Stock, User} = require('./models');
const {encryptPassword, setAuth} = require('./utils');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async(req, res)=> {
    // res.sendFile(__dirname + "\\public\\index.html");
    
    fs.readFile(__dirname+"\\public\\index.html", (err, data) => {
        console.log('terminal')
        if(err){
            console.log('error occured at url \'/\'.');
            res.status(404).send('Not Found');
        } else{
            console.log("Requesting url '/'.");
            res.end(data);
        }
    });
})

app.get('/:month', async(req, res) => {
    fs.readFile(__dirname + "\\public\\index.html", (err, data) => {
        if(err){
            console.log('error occured at path /:month');
            res.status(400).send('Invalid Month');
        }   else{
            res.end(data);
        }
    })
})

app.get('/books', setAuth, async(req, res) => {
    const user = req.user;
    try{
    const books = await Book.find({user});
    const bookstitle = books.map(e => e.title); 
    const booksAuthor = books.map(e => e.author);
    const booksQuote = books.map(e => e.quote);
    const booksjson = {bookstitle, booksAuthor, booksQuote};  
    res.send(booksjson);
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating maps. Tell to admin'});
    }
})
app.get('/books/:book', setAuth, async(req, res) => {
    const user = req.user;
    const {bookTitle} = req.params;
    try{
        const book = await Book.find({user, title:bookTitle});
        const {title, author, quote, genre, page, rating} = book;
        res.send({title, author, quote, genre, page, rating});
    } catch(err){
        return res.status(400).send({error : 'Error found when showing the book. Ask admin.'});
    }
})





app.post('/books/create', setAuth, async(req, res) => {
    const user = req.user;
    const {title, author, quote, genre, page, rating} = req.body
    const book = new Book({
        title : title,
        author : author,
        quote : quote,
        genre : genre, 
        page : page, 
        user : user,
        rating : rating
    });
    await book.save();
    res.send(book);
})

app.get('/portfolio', setAuth, async(req, res) => {
    const user = req.user;
    const portfolio = await Asset.find({user}); 
})

app.listen(port, ()=> {
    console.log(`listening at port: ${port}`)
})

// C : post R : get U : put D : delete