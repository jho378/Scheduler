const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const {Bucketlist, User} = require('../models')
const fs = require('fs');

// creating a bucketlist
router.post('/create', setAuth, async(req, res) => {
    const user = req.user;
    const {title, description} = req.body;
    const bucketlist = new Bucketlist({
        title, description, isDone : false, user,
    });
    await bucketlist.save();
    return res.send(bucketlist);
});

router.get('/', setAuth, async(req, res) => {

    const user = req.user;
    try{
        const bucketlists = await Bucketlist.find({user});
        const titles = bucketlists.map(e => e.title);
        const isDones = bucketlists.map(e => e.isDone);
        fs.readFile("./public/bucketlist.html", (err, data) => {
            if(err){
                console.error(err);
                res.status(400).send('Invalid URI');
            }   else{
                res.send(data, titles, isDones);
            }
        })
    }   catch(err){
        return res.status(400).send({error : 'Cannot get access to bucketlists.'});
    }
});

router.route('/:bucketlisttitle')
    .get(setAuth, async(req, res)=> {
        const user = req.user;
        const {bucketlistTitle} = req.params;
        try{
            const bucketlist = await Bucketlist.findOne({user, title:bucketlistTitle});
            const {title, description, isDone} = bucketlist;
            return res.send({title, description, isDone});
        }   catch(err){
            return res.status(400).send({error : 'Error found when accessing to the bucketlist'});
        }
    })
    .put(setAuth, async(req, res) => {
        const user = req.user;
        const {bucketlistTitle} = req.params;
        const {title, description, isDone} = req.body;
        const bucketlist = await Bucketlist.findOne({user, title:bucketlistTitle});
        bucketlist.title = title;
        bucketlist.description = description; 
        bucketlist.isDone = isDone;
        
        await bucketlist.save();
        return res.send(bucketlist);
    })
    .delete(setAuth, async(req, res) => {
        const user = req.user;
        const {bucketlistTitle} =req.params;
        await Bucketlist.findOneAndDelete({user, title:bucketlistTitle}, (err, deleted) => {
            if(err) return res.status(400).send({error : 'Cannot delete a item now.'})
            else return res.send({deleted});
        })
});

module.exports = router;