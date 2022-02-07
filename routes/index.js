const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
// router.get('/', (req, res) => {
//     res.send('This is index page!');
// })

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "../public/html/index.html"), (err, data) => {
        if(err){
            console.log(err);
            console.log('error occured at path /:month');
            res.status(400).send('Invalid Month');
        }   else{
            res.end(data);
        }
    })
})
router.get('/traveler', (req, res) => {
    fs.readFile(path.join(__dirname, "../public/html/traveler.html"), (err, data) => {
        if(err){
            console.log(err);
            console.log('error occured at path /traveler');
            res.status(400).send('Invalid uri');
        }   else{
            res.end(data);
        }
    })
})

router.get('/:month', async(req, res) => {
    const {month} = req.params;
    fs.readFile(path.join(__dirname, "../public/html/index.html"), (err, data) => {
        if(err){
            console.log('error occured at path /:month');
            res.status(400).send('Invalid Month');
        }   else{
            res.end(data);
        }
    })
})

module.exports = router;
