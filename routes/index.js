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
    let now = new Date();
    now = String(now);
    now = now.split(' ');
    for(const schedule of schedules){
        let _date = String(schedule.date);
        _date = _date.split(' ').slice(1,4);
        const mth = _date[0];
        const year = _date[2];
        if(year === now[3] && mth=== now[1]){
            _schedules.push(schedule);
        }
        // console.log(_schedules)
    }
    
    res.render("index", {schedules : _schedules, year : now[3]});
})
router.get('/:year/:month', setAuth, async(req, res) => {
    const user = req.user;
    
    const year = req.params.year;
    const month = req.params.month;

    res.render("index", {year : year});
    // const schedules = await Schedule.find({})
})
router.get('/hidden/:year/:month', setAuth, async(req, res) => {
    const user = req.user;
    const schedules = await Schedule.find({user});

    const year = req.params.year;
    const month = req.params.month;

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const _schedules = [];
    for(const schedule of schedules){
         let _date = String(schedule.date);
         _date = _date.split(' ').slice(1,4);
         const yr = _date[2];
         const mth = _date[0];
         if(year===yr && months.indexOf(mth.toUpperCase()) === months.indexOf(month)) _schedules.push(schedule);
         else if(year===yr && months.indexOf(mth.toUpperCase()) === months.indexOf(month) + 1) _schedules.push(schedule);
         else if(year===yr && months.indexOf(mth.toUpperCase()) === months.indexOf(month) - 1) _schedules.push(schedule);
         else if(year===yr+1){
             if(month === "DEC" && mth.toUpperCase() === "JAN") _schedules.push(schedule);
         }
         else if(year===yr-1){
             if(month==="JAN" && mth.toUpperCase() === "DEC") _schedules.push(schedule);
         }
         
    }
    return res.send(_schedules);
})


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

// router.get('/hidden', setAuth, async(req, res)=> {
//     const user = req.user;
//     const schedules = await Schedule.find({user});
//     const _schedules = [];
//     for(const schedule of schedules){
//         let _date = String(schedule.date);
//         _date = _date.split(' ').slice(1,4);
//         const mth = _date[0];
//         const year = _date[2];
//         let now = new Date();
//         now = String(now);
//         now = now.split(' ');
//         if(year === now[3] && mth=== now[1]){
//             _schedules.push(schedule);
//         }
//         console.log(_schedules)
//     }
    
//     return res.send(_schedules);
// })


module.exports = router;
