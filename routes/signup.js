const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const { Asset, Coin, Stock, User } = require('../models');
const { encryptPassword } = require('../utils');

router.post(
    '/submit',
    body('id')
        .isAlphanumeric()
        .withMessage('error : user ID must be alphanumeric')
        .isLength({ min: 4, max: 20 })
        .withMessage(
            'error : user ID should be longer than 4 words, shorter than 20 words'
        ),
    body('password')
        .isLength({ min: 6, max: 16 })
        .withMessage(
            'error : Password should be longer than 6 words, shorter than 16 words.'
        ),
    body('lastname')
        .isAlphanumeric()
        .withMessage('error : Name must be alphanumeric')
        .isLength({ min: 1, max: 10 })
        .withMessage(
            'error : last name must be longer than 1 word, shorter than 10 words'
        ),
    body('firstname')
    .isAlphanumeric()
    .withMessage('error : Name must be alphanumeric')
    .isLength({ min: 1, max: 10 })
    .withMessage(
        'error : first name must be longer than 1 word, shorter than 10 words'
    ),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        const { id, password, passwordConfirm, lastname, firstname, gender } = req.body;
        const yy = Number(req.body.yy);
        const mm = Number(req.body.mm) -1;
        const dd = Number(req.body.dd) +1;
        console.log(yy, mm, dd)
        if(password!==passwordConfirm){
            return res.status(400).send({error : 'Please check if you have written same password in the confirmation.'});
        }
        const encryptedPassword = encryptPassword(password);
        
        const birthday = new Date(yy, mm, dd);
        let user = null;
        try {
            user = new User({
                id,
                password: encryptedPassword,
                lastname,
                firstname,
                birthday,
                created : new Date(), 
                gender,
                isDeleted: false,
            });
            await user.save();
        } catch (err) {
            return res.status(400).send({ error: 'Email is duplicated.' });
        }
        const stocks = await Stock.find({ isActive: true });
        for (const stock of stocks) {
            const asset = new Asset({
                name: stock.name,
                ticker: stock.ticker,
                sector: stock.sector,
                industry: stock.industry,
                averagePrice: 0,
                balance: 0,
                assetType: 'stock',
                user,
            });
            await asset.save();
        }
        const coins = await Coin.find({ isActive: true });
        for (const coin of coins) {
            const asset = new Asset({
                name: coin.name,
                sector: coin.sector,
                industry: coin.industry,
                averagePrice: 0,
                balance: 0,
                assetType: 'cryptocoin',
                user,
            });
            await asset.save();
        }
        
        // return res.send(user);
        return res.redirect('/');
    }
);

module.exports = router;
