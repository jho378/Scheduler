const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const {Schedule, User} = require('../models')

// creating a schedule
router.post('/create', setAuth, async(req, res) => {
    const user = req.user;
    const {date, title, description} = req.body;
    const id = await Schedule.countDocuments({user}) + 1;
    const schedule = new Schedule({
        date, title, description, user, id, isDone : false, isDeleted : false,
    });
    await schedule.save();
    return res.send(schedule);
})
// reading schedules
router.get('/', setAuth, async(req, res) =>{
    const user = req.user;
    try{
    const schedules = await Schedule.find({user, isDeleted : false});
    const dates = schedules.map(e => e.date); 
    const descriptions = schedules.map(e => e.description);
    const isDones = schedules.map(e => e.isDone);
    const schedulesJson = {dates, descriptions, isDones};  
    return res.send(schedulesJson);
    } catch(err){
        return res.status(400).send({error: 'Error occured when updating schedules.'});
    }
})
router.route('/:id')
    // reading a single schedule
    .get(setAuth, async(req,res) =>{
        const user = req.user;
        const {scheduleId} = req.params;
        try{
            const schedule = await Schedule.findOne({user, id:parseInt(scheduleId), isDeleted : false,});
            const {date, title, description, user, id, isDone} = schedule;
            return res.send({date, title, description, user, id, isDone});
        } catch(err){
            return res.status(400).send({error : 'Error found when showing the book. Ask admin.'});
        }
    })
    // updating a schedule
    .put(setAuth, async(req, res)=> {
        const user = req.user;
        const {scheduleId} = req.params;
        const {date, title, description, isDone} = req.body;
        const _schedule = await Schedule.findOne({user, id : parseInt(scheduleId), isDeleted: false});

        _schedule.date = date;
        _schedule.title = title;
        _schedule.description = description;
        _schedule.isDone = isDone;
        await _schedule.save();
        return res.send(_schedule);
    })
    // deleting a schedule 
    .delete(setAuth, async(req, res) => {
        const user = req.user;
        const {scheduleId} = req.params;
        const _schedule = await Schedule.findOne({user, id : parseInt(scheduleId), isDeleted:false});
        
        _schedule.isDeleted = true;
        await _schedule.save();
        // id 순서 다시 바꿔주는 로직!
        return res.send(_schedule);
    });
    
module.exports = router;
