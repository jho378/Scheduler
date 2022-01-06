const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');

const { encryptPassword } = require('../utils');
const { User, Key } = require('../models');

router.post('/', async (req, res) => {
    const { id, password } = req.body;
    const encryptedPassword = encryptPassword(password);
    const user = await User.findOne({ id });
    if (user === null)
        return res.status(404).send({ error: 'User is not found' });
    else if (user.password !== encryptedPassword)
        return res.status(403).send({ error: 'Wrong Password' });
    const pub = encryptPassword(crypto.randomBytes(20));
    const sec = encryptPassword(crypto.randomBytes(20));
    // const _jwt = jwt.sign({publicKey : pub}, sec, {expiresIn : 3600});

    const key = new Key({
        publicKey: pub,
        secretKey: sec,
        user,
        isActive: true,
    });
    await key.save();

    const { schedules } = user;
    const userInfo = { schedules };
    return res.send({
        userInfo,
        publicKey: key.publicKey,
        secretKey: key.secretKey,
    });
});

module.exports = router;
