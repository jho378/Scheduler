const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const {User, Workout} = require('../models')

// creating workout history
router.post('/create', setAuth, async(req, res) => {
    const user = req.user;
    const {name, weight, set, rep} = req.body;
    const _workout = await Workout.findOne({name, id:0});
    const userWorkout = await Workout.find({user});
    const historyLength = userWorkout.length
    const workout = new Workout({
        name, part : _workout.part, weight, set, rep, date : new Date(), user, id : historyLength+1,
    })
    await workout.save();
    return res.send(200);
})

// reading workout histories
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    try{
        const workouts = await Workout.find({user});
        const volume = [];
        workouts.forEach(e => {
            volume.push(e.weight * e.set * e.rep);
        })
        return res.send({volume, workouts});
    }   catch(err){
        return res.status(404).send({error: 'No workout history found.'})
    }
})

router.route('/:workoutId')
    .get(setAuth, async(req, res) => {
        const user = req.user;
        const {id} = req.params;
        try{
            const workout = await Workout.findOne({user, id});
            const volume = workout.weight * workout.set * workout.rep;
            return res.send({workout, volume});
        }   catch(err){
            return res.status(400).send({error : 'No corresponding information found. It could have been deleted.'});
        }
    })
    .put(setAuth, async(req, res)=> {
        const user = req.user;
        const {id} = req.params;
        const {name, weight, set, rep, date} = req.body;
        try{
            const workout = await Workout.findOne({user, id});
            workout.name = name;
            workout.weight = weight;
            workout.set = set;
            workout.rep = rep;
            workout.date = date;
            await workout.save();
            return res.send({workout})
        }   catch(err){
            return res.status(400).send({error : 'Invalid request'});
        }
    })
    .delete(setAuth, async(req, res)=> {
        const user = req.user;
        const {id} = req.params;
        try{
        const deleted = Workout.findOne({user, id});
        await Workout.deleteOne({user, id});
        return  res.send({deleted});
        }   catch(err){
            return res.status(400).send({error : 'Cannot delete a item now. Try again later.'})
        } 
    })

module.exports =router;

// done by now. 12.30