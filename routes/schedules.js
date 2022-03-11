const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const { Schedule, User } = require('../models');

// creating a schedule
router.post('/create', setAuth, async (req, res) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const user = req.user;
    const title = req.body.schedule_title;
    const description = req.body.schedule_description;
    const date = req.body.schedule_starting_date;
    const startingDate = req.body.schedule_starting_date;
    const finishingDate = req.body.schedule_finishing_date;
    const [startYear, startMonth, startDay] = [Number(startingDate[2]), months.indexOf(startingDate[0]), Number(startingDate[1])];
    const [finishYear, finishMonth, finishDay] = [Number(finishingDate[2]), months.indexOf(finishingDate[0]), Number(finishingDate[1])];
    const startDate = new Date(startYear, startMonth, startDay);
    const finishDate = new Date(finishYear, finishMonth, finishDay);
    const period = (finishDate - startDate) / (24*60*60*1000) + 1;
    
    // const { date, title, description, period } = req.body;
    // console.log(req.body)
    const id = (await Schedule.countDocuments({ user })) + 1;
    const schedule = new Schedule({
        date,
        title,
        description,
        user,
        period,
        id,
        isDone: false,
        isDeleted: false,
    });
    console.log(schedule);
    await schedule.save();
    // return res.send(schedule);
    return res.redirect('/');
});
// reading schedules
router.get('/', setAuth, async (req, res) => {
    const user = req.user;
    try {
        const schedules = await Schedule.find({ user, isDeleted: false });
        const dates = schedules.map((e) => e.date);
        const titles = schedules.map((e) => e.title);
        const isDones = schedules.map((e) => e.isDone);
        const schedulesJson = { dates, titles, isDones };
        return res.send(schedulesJson);
    } catch (err) {
        return res
            .status(400)
            .send({ error: 'Error occured when updating schedules.' });
    }
});
router
    .route('/:scheduleId')
    // reading a single schedule
    .get(setAuth, async (req, res) => {
        const user = req.user;
        const { scheduleId } = req.params;
        try {
            const schedule = await Schedule.findOne({
                user,
                id: parseInt(scheduleId),
                isDeleted: false,
            });
            const { date, title, description, period, id, isDone } = schedule;
            return res.send({
                date,
                title,
                description,
                user,
                period,
                id,
                isDone,
            });
        } catch (err) {
            return res.status(400).send({
                error: 'Error found when showing the schedules. Ask admin.',
            });
        }
    })
    // updating a schedule
    .put(setAuth, async (req, res) => {
        const user = req.user;
        const { scheduleId } = req.params;
        const { date, title, description, period, isDone } = req.body;
        const schedule = await Schedule.findOne({
            user,
            id: parseInt(scheduleId),
            isDeleted: false,
        });

        schedule.date = date;
        schedule.title = title;
        schedule.description = description;
        schedule.period = period;
        schedule.isDone = isDone;
        await schedule.save();
        return res.send({ schedule });
    })
    // deleting a schedule
    .delete(setAuth, async (req, res) => {
        const user = req.user;
        const { scheduleId } = req.params;
        const schedule = await Schedule.findOne({
            user,
            id: parseInt(scheduleId),
            isDeleted: false,
        });
        if (!schedule)
            return res
                .status(404)
                .send({ error: 'Cannot find a chosen schedule' });
        schedule.isDeleted = true;
        await schedule.save();
        // id 순서 다시 바꿔주는 로직!
        return res.send(schedule);
    });

module.exports = router;
