const express = require('express');
const fs = require('fs');
const router = express.Router();

const { setAuth } = require('../utils');
const {Asset, Coin, Stock, User} = require('../models')


// reading assets
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    const assets = await Asset.find({user});
    const _assets = assets.filter(e => e.balance!==0);
    const assetsObj = {};
    _assets.forEach(e => assetsObj[e.name] = e.balance);
    res.send(assetsObj);
});

// creating assets
router.put('/stock/:stock/add', setAuth, async(req, res) => {
    const user = req.user;
    const {ticker} = req.params;
    await parsing(ticker);
    await subParsing(ticker);
    
    let stocksData = fs.readFileSync('../datas/stocks.json').toString();
    stocksData = JSON.parse(stocksData);

    const stock = new Stock({
        name : stocksData[stocksData.length -1].name,
        ticker : stocksData[stocksData.length -1].ticker,
        sector : stocksData[stocksData.length -1].sector,
        industry : stocksData[stocksData.length -1].industry,
        assetType : 'stock',
        isActive : true
    })
    await stock.save();

    const users = await User.find({isDeleted : false});
    for(const _user of users){
        const asset = new Asset({
            name : stock.name,
            ticker : stock.ticker,
            sector : stock.sector, 
            industry : stock.industry,
            averagePrice : 0,
            balance : 0,
            assetType : "stock",
            user : _user,
        })
        await asset.save();
    }
    return res.send({stock, ticker});
});

// buying stocks
router.post('/stock/:stock/buy', setAuth, async(req, res)=>{
    const user = req.user;
    const {ticker} = req.params;
    const {purchasePrice, quantity} = req.body;
    const asset = await Asset.findOne({user, ticker});

    // login 할때 다 배정해두고 문제 없게 하자! 아직없는 stock 은!? 
    const {averagePrice, balance} = asset;
    asset.averagePrice = balance*averagePrice+quantity*purchasePrice/(balance + quantity);
    asset.balance += quantity;
    await asset.save();
    
    let stockHistoryData = fs.readFileSync('../datas/stocksHistory.json').toString();
    stockHistoryData = JSON.parse(stockHistoryData);
    stockHistoryData.push({
        ticker, purchasePrice, quantity, dateOfPurchase : new Date(), user, 
    })
    fs.writeFileSync('../datas/stocksHistory.json', JSON.stringify(stockHistoryData));
    return res.send({asset, purchasePrice, quantity});
})

// selling stocks
router.post('/stock/:stock/sell', setAuth, async(req, res)=>{
    const user = req.user;
    const {ticker} =req.params;
    const {sellPrice, quantity} = req.body;
    const asset = await Asset.findOne({user, ticker});
    const {balance} = asset;
    if(balance-quantity<0)  return res.status(400).send({error: 'You don\'t have enough stocks.'});
    else asset.balance -= quantity;
    await asset.save();
    let stockHistoryData = fs.readFileSync('../datas/stocksHistory.json').toString();
    stockHistoryData = JSON.parse(stockHistoryData);
    stockHistoryData.push({
        ticker, sellPrice, quantity, dateOfSell : new Date(), user, 
    });
    fs.writeFileSync('../datas/stocksHistory.json', JSON.stringify(stockHistoryData));
    return res.send({asset, sellPrice, quantity, averagePrice});
})





module.exports = router;