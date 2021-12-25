const express = require('express');
const {body, validationResult} = require('express-validator');
const crypto = require('crypto');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const {Asset, Book, Coin, Key, Stock, User, Schedule} = require('./models');
const {encryptPassword, setAuth} = require('./utils');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async(req, res)=> {
    // res.sendFile(__dirname + "\\public\\index.html");
    // res.sendFile(path.join(__dirname, ))
    fs.readFile(__dirname+"\\public\\index.html", (err, data) => {
        
        if(err){
            console.log('error occured at url \'/\'.');
            res.status(404).send('Not Found');
        } else{
            console.log("Requesting url '/'.");
            res.end(data);
        }
        console.log('terminal')
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





// Book create
app.post('/books/create', setAuth, async(req, res) => {
    const user = req.user;
    const {title, author, quote, genre, page, rating} = req.body
    const book = new Book({
        title, author, quote, genre, page, user, rating, isDeleted : false
    });
    await book.save();
    res.send(book);
})
// Books read
app.get('/books', setAuth, async(req, res) => {
    const user = req.user;
    try{
    const books = await Book.find({user, isDeleted : false});
    const bookstitle = books.map(e => e.title); 
    const booksAuthor = books.map(e => e.author);
    const booksQuote = books.map(e => e.quote);
    const booksjson = {bookstitle, booksAuthor, booksQuote};  
    res.send(booksjson);
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating books.'});
    }
});
// Book read
app.get('/books/:book', setAuth, async(req, res) => {
    const user = req.user;
    const {bookTitle} = req.params;
    try{
        const book = await Book.findOne({user, title:bookTitle, isDeleted : false});
        const {title, author, quote, genre, page, rating} = book;
        res.send({title, author, quote, genre, page, rating});
    } catch(err){
        return res.status(400).send({error : 'Error found when showing the book. Ask admin.'});
    }
})
// Book update
app.put('/books/:book', setAuth, async(req, res) => {
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

})
// Book delete
app.delete('/books/:book', setAuth, async(req, res) => {
    const user = req.user;
    const {bookTitle} = req.params;
    const _book = await Book.findOne({user, title : bookTitle, isDeleted : false});
    
    _book.isDeleted = true;
    await _book.save();
    res.send(_book);
})

// Book done by now ; 


// Schedule create
app.post('/schedules/create', setAuth, async(req, res) => {
    const user = req.user;
    const {date, title, description} = req.body;
    const id = await Schedule.countDocuments({user}) + 1;
    const schedule = new Schedule({
        date, title, description, user, id, isDone : false, isDeleted : false,
    });
    await schedule.save();
    res.send(schedule);
})
// Schedules read
app.get('/schedules', setAuth, async(req, res) => {
    const user = req.user;
    try{
    const schedules = await Schedule.find({user, isDeleted : false});
    const dates = schedules.map(e => e.date); 
    const descriptions = schedules.map(e => e.description);
    const isDones = schedules.map(e => e.isDone);
    const schedulesJson = {dates, descriptions, isDones};  
    res.send(schedulesJson);
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating schedules.'});
    }
});
// single Schedule read
app.get('/schedules/:id', setAuth, async(req, res) => {
    const user = req.user;
    const {scheduleId} = req.params;
    try{
        const schedule = await Schedule.findOne({user, id:parseInt(scheduleId), isDeleted : false,});
        const {date, title, description, user, id, isDone} = schedule;
        res.send({date, title, description, user, id, isDone});
    } catch(err){
        return res.status(400).send({error : 'Error found when showing the book. Ask admin.'});
    }
})
// Schedule update
app.put('/schedules/:id', setAuth, async(req, res)=> {
    const user = req.user;
    const {scheduleId} = req.params;
    const {date, title, description, isDone} = req.body;
    const _schedule = await Schedule.findOne({user, id : parseInt(scheduleId), isDeleted: false});

    _schedule.date = date;
    _schedule.title = title;
    _schedule.description = description;
    _schedule.isDone = isDone;
    await _schedule.save();
})
// Schedule delete 
app.delete('/schedules/:id', setAuth, async(req ,res) => {
    const user = req.user;
    const {scheduleId} = req.params;
    const _schedule = await Schedule.findOne({user, id : parseInt(scheduleId), isDeleted:false});
    
    _schedule.isDeleted = true;
    await _schedule.save();
    // id 순서 다시 바꿔주는 로직!
    res.send(_schedule);
})





app.get('/portfolio', setAuth, async(req, res) => {
    const user = req.user;
    const portfolio = await Asset.find({user}); 
})

app.listen(port, ()=> {
    console.log(`listening at port: ${port}`)
})

// C : post R : get U : put D : delete