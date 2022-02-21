const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const { encryptPassword } = require('../utils');
const { User, Key } = require('../models');

require('dotenv').config();

router.post('/submit', async (req, res) => {
    const { id, password } = req.body;
    const encryptedPassword = encryptPassword(password);
    const user = await User.findOne({ id });
    const firstName = user.firstName;
    if (user === null)
        return res.status(404).send({ error: 'User is not found' });
    else if (user.password !== encryptedPassword)
        return res.status(403).send({ error: 'Wrong Password' });
    
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {expiresIn : 14 * 24 * 60 * 60});
    user.refreshToken = refreshToken;
    await user.save();
    const accessToken = jwt.sign({id, firstName}, process.env.JWT_SECRET, {expiresIn: 20 * 60});
    // res.cookie('accessToken', accessToken, {httpOnly : true});
    res.cookie('accessToken', accessToken, {sameSite : true, httpOnly : true});
    res.cookie('refreshToken', refreshToken, {sameSite : true, httpOnly : true});

    // const pub = encryptPassword(crypto.randomBytes(20));
    // const sec = encryptPassword(crypto.randomBytes(20));
    // const _jwt = jwt.sign({publicKey : pub}, sec, {expiresIn : 3600});

    // const key = new Key({
    //     publicKey: pub,
    //     secretKey: sec,
    //     user,
    //     isActive: true,
    // });
    // await key.save();

    // const { schedules } = user;
    // const userInfo = { schedules };
    return res.redirect('/')
    // return res.send({
    //     userInfo,
    //     publicKey: key.publicKey,
    //     secretKey: key.secretKey,
    // });
});

module.exports = router;
