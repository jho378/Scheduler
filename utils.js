const crypto = require('crypto');
const User = require('./models/User');
const Key = require('./models/Key');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const encryptPassword = (password) => {
    return crypto.createHash('sha512').update(password).digest('base64');
};

const setAuth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    // front : const key = jwt.sign({publicKey : pub}, sec {expiresIn : 3600});
    const [bearer, key] = authorization.split(' ');
    if (bearer !== 'Bearer')
        return res.status(400).send({ error: 'Wrong Authorization' });
    const decodedJwt = jwt.decode(key);
    if (decodedJwt === null)
        return res.status(400).send({ error: 'Invalied Key' });
    const _pub = decodedJwt.publicKey;
    const _key = await Key.findOne({ publicKey: _pub });
    let user = null;
    try {
        console.log('verifying');
        const verified = jwt.verify(key, _key.secretKey);
        // user = await User.findById(_key.user);
        user = _key.user;
    } catch (e) {
        return res.status(403).send({ error: 'Invalid token' });
    }
    if (!user) return res.status(404).send({ error: 'Cannot find user' });
    req.user = user;
    return next();
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
