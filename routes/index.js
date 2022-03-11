const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const { setAuth } = require('../utils');
const cookieParser = require('cookie-parser');
const { Schedule } = require('../models');
// router.get('/', (req, res) => {
//     res.send('This is index page!');
// })
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    const schedules = await Schedule.find({user});
    const _schedules = [];
    for(const schedule of schedules){
        let _date = String(schedule.date);
        _date = _date.split(' ').slice(1,4);
        console.log(_date)
        const mth = _date[0];
        const year = _date[2];
        let now = new Date();
        now = String(now);
        now = now.split(' ');
        if(year === now[3] && mth=== now[1]){
            _schedules.push(schedule);
        }
        // console.log(_schedules)
    }
    
    res.render("index", {schedules : _schedules});
})
router.get('/hidden', setAuth, async(req, res)=> {
    const user = req.user;
    const schedules = await Schedule.find({user});
    const _schedules = [];
    for(const schedule of schedules){
        let _date = String(schedule.date);
        _date = _date.split(' ').slice(1,4);
        const mth = _date[0];
        const year = _date[2];
        let now = new Date();
        now = String(now);
        now = now.split(' ');
        if(year === now[3] && mth=== now[1]){
            _schedules.push(schedule);
        }
        console.log(_schedules)
    }
    
    return res.send(_schedules);
})
// router.get('/', setAuth, async(req, res) => {
//     fs.readFile(path.join(__dirname, "../public/html/index.html"), async(err, data) => {
//         if(err){
//             console.log(err);
//             console.log('error occured at path /:month');
//             res.status(400).send('Invalid Month');
//         }   else{
//             // console.log(req.headers.authorization);
//             const user = req.user;
//             const schedules = await Schedule.find({user});
//             for(const schedule of schedules){
//                 const _date = String(schedule.date);
//                 console.log(_date.split(' ').slice(1,4));
//             }
//             console.log(schedules);
//             return res.end(data);
//         }
//     })
// })

// router.get('/:month', async(req, res) => {
//     const {month} = req.params;
//     fs.readFile(path.join(__dirname, "../public/html/index.html"), (err, data) => {
//         if(err){
//             console.log('error occured at path /:month');
//             res.status(400).send('Invalid Month');
//         }   else{
//             res.end(data);
//         }
//     })
// })

module.exports = router;
