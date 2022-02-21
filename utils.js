const crypto = require('crypto');
const User = require('./models/User');
const Key = require('./models/Key');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

require('dotenv').config();

const encryptPassword = (password) => {
    return crypto.createHash('sha512').update(password).digest('base64');
};

const verify = (token) => {
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET)
    }   catch(err){
        if(err.message==='jwt expired'){
            console.log('TOKEN EXPIRED')
            return TOKEN_EXPIRED;
        }
        else if(err.message === 'invalid token'){
            console.log('INVALID TOKEN');
            return TOKEN_INVALID;
        }
        else{
            console.log('VERIFYING TOKEN ERROR OCCUR')
            return TOKEN_INVALID; 
        }
    }
}
const setAuth = async (req, res, next) => {
    if(req.cookies.accessToken===undefined) return res.status(400).send({error : 'No access token arrived to the server'});

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    const accessVerified = verify(accessToken);
    const refreshVerified = verify(refreshToken);

    if(accessVerified===TOKEN_INVALID || refreshVerified===TOKEN_INVALID){
        return res.status(400).send({error : 'Strange token submitted'});
    }

    const user = await User.findOne({refreshToken : refreshToken});
    if(!user) return res.status(400).send({error : "No user found with given refresh token."});

    if(accessVerified=== TOKEN_EXPIRED){
        if(refreshVerified===TOKEN_EXPIRED){
            return res.redirect('/html/signin.html').send({error : 'All the tokens expired, please sign in again'});
        }   else{
            console.log('Access expired, refresh good');
            const newAccessToken = jwt.sign({id : user.id, firstName : user.firstName}, process.env.JWT_SECRET, {expiresIn: 20 * 60});
            res.cookie('accessToken', newAccessToken);
            req.cookies.accessToken = newAccessToken;
            req.user = user;
            return next();
        }
    }   else{
        if(refreshVerified===TOKEN_EXPIRED){
            console.log('Access good, refresh EXPIRED');
            const newRefreshToken = jwt.sign({}, process.env.JWT_SECRET, {expiresIn : 14 * 24 * 60 * 60});
            user.refreshToken = newRefreshToken;
            await user.save();
            res.cookie('refreshToken', newRefreshToken);
            req.cookies.refreshToken = newRefreshToken;
            req.user = user;
            return next();
        } else{
            req.user = user;
            return next();
        }
    }
};

const getHTML = async (ticker) => {
    try {
        return await axios.get(
            `https://finance.yahoo.com/quote/${ticker}/profile?p=${ticker}`
        );
    } catch (err) {
        console.log({ error: 'Error occured when parsing sub html' });
    }
};

const parsing = async (ticker) => {
    const html = await getHTML(ticker);
    const $ = cheerio.load(html.data);
    const $price = $('#quote-header-info');
    $price.each((idx, node) => {
        const priceText = $(node).text();
        const stockName = priceText.slice(0, priceText.indexOf('(') - 1);
        console.log(stockName);
        let stocksJson = fs.readFileSync('./datas/stocks.json').toString();
        stocksJson = JSON.parse(stocksJson);
        stocksJson.push({ ticker: ticker, name: stockName });
        fs.writeFileSync('./datas/stocks.json', JSON.stringify(stocksJson));
    });
    const $field = $('.asset-profile-container');
    $field.each((idx, node) => {
        const fieldText = $(node).text();
        const fieldArr = fieldText.split('Industry');
        const sector = fieldArr[0].slice(fieldArr[0].indexOf('):') + 3);
        const industry = fieldArr[1].slice(2, fieldArr[1].indexOf('Full Time'));
        let stocksJson = fs.readFileSync('./datas/stocks.json').toString();
        stocksJson = JSON.parse(stocksJson);
        const index = stocksJson.findIndex((e) => e.ticker === ticker);
        stocksJson[index].sector = sector;
        stocksJson[index].industry = industry;
        fs.writeFileSync('./datas/stocks.json', JSON.stringify(stocksJson));
    });
};

module.exports = {
    encryptPassword,
    setAuth,
    getHTML,
    parsing,
};
