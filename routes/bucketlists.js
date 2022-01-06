const express = require('express');
const router = express.Router();

const { setAuth } = require('../utils');
const { Bucketlist, User } = require('../models');
const fs = require('fs');

// creating a bucketlist
router.post('/create', setAuth, async (req, res) => {
    const user = req.user;
    const { title, description } = req.body;
    const bucketlist = new Bucketlist({
        title,
        description,
        isDone: false,
        user,
    });
    await bucketlist.save();
    return res.send(bucketlist);
});

router.get('/', setAuth, async (req, res) => {
    const user = req.user;
    try {
        const bucketlists = await Bucketlist.find({ user });
        const titles = bucketlists.map((e) => e.title);
        const isDones = bucketlists.map((e) => e.isDone);
        return res.send({ titles, isDones });
    } catch (err) {
        return res
            .status(400)
            .send({ error: 'Cannot get access to bucketlists.' });
    }
});

router
    .route('/:bucketlistTitle')
    .get(setAuth, async (req, res) => {
        const user = req.user;
        const { bucketlistTitle } = req.params;
        try {
            const bucketlist = await Bucketlist.findOne({
                user,
                title: String(bucketlistTitle),
            });
            const { title, description, isDone } = bucketlist;
            return res.send({ title, description, isDone });
        } catch (err) {
            return res.status(400).send({
                error: 'Error found when accessing to the bucketlist',
            });
        }
    })
    .put(setAuth, async (req, res) => {
        const user = req.user;
        const { bucketlistTitle } = req.params;
        const { title, description, isDone } = req.body;
        const bucketlist = await Bucketlist.findOne({
            user,
            title: bucketlistTitle,
        });
        if (!bucketlist)
            return res.status(400).send({
                error: 'bucketlist not found. Might have been changed already.',
            });
        bucketlist.title = title;
        bucketlist.description = description;
        bucketlist.isDone = isDone;

        await bucketlist.save();
        return res.send(bucketlist);
    })
    .delete(setAuth, async (req, res) => {
        const user = req.user;
        const { bucketlistTitle } = req.params;
        const deleted = await Bucketlist.findOne({
            user,
            title: bucketlistTitle,
        });
        if (!deleted)
            return res.status(400).send({
                error: 'Bucketlist not found. Might have been already deleted.',
            });
        await Bucketlist.findOneAndDelete({ user, title: bucketlistTitle });
        return res.send({ deleted });
    });

module.exports = router;
