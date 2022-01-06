const express = require('express');
const fs = require('fs');
const router = express.Router();

const {parsing, getHTML, setAuth} = require('../utils');
const {Asset, Coin, Stock, User} = require('../models')


// reading assets
router.get('/', setAuth, async(req, res) => {
    const user = req.user;
    const assets = await Asset.find({user});
    const _assets = assets.filter(e => e.balance!==0);
    const _stocks = assets.filter(e => e.balance!==0 && e.assetType === 'stock');
    const _coins = assets.filter(e => e.balance!==0 && e.assetType === 'cryptocoin');
    const assetsObj = {};
    _assets.forEach(e => assetsObj[e.name] = e.balance);
    res.send({_assets, _stocks, _coins});
});

// creating stocks
router.put('/stock/:ticker/add', setAuth, async(req, res) => {
    const user = req.user;
    const {ticker} = req.params;
    
    await parsing(ticker);
    console.log('parsing done');
    
    let stocksData = fs.readFileSync('./datas/stocks.json').toString();
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
    console.log(`'${ticker}' added in database`);
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

// creating coins
router.put('/coin/:coinName/add', setAuth, async(req, res) => {
    const user = req.user;
    const {coinName} = req.params;

    let coinsData = fs.readFileSync('./datas/coins.json').toString();
    coinsData = JSON.parse(coinsData);
    try{
    const coin = new Coin({
        name : coinName,
        sector: 'Crypto', 
        industry : 'Crypto', 
        assetType : 'cryptocoin', 
    })
    coinsData.push({name : coinName, sector : 'Crypto', industry : 'Crypto'})
    fs.writeFileSync('./datas/coins.json', JSON.stringify(coinsData));

    await coin.save();
    const users = await User.find({isDeleted : false});
    for(const _user of users){
        const asset = new Asset({
            name : coin.name,
            sector: 'Crypto', 
            industry : 'Crypto', 
            averagePrice : 0,
            balance : 0,
            assetType : 'cryptocoin', 
            user : _user,
        })
        await asset.save();
        return res.send({coin, coinName});
    }}   catch(err){
        return res.status(400).send({error : `The coin with the name '${coinName}' already exists.`})
    }
})

// buying stocks
router.post('/stock/:ticker/buy', setAuth, async(req, res)=>{
    const user = req.user;
    const {ticker} = req.params;
    const purchasePrice = Number(req.body.purchasePrice);
    const quantity = Number(req.body.quantity);
    
    const asset = await Asset.findOne({user, ticker});
    if(!asset)  return res.status(404).send({error : `${ticker} not registered by now. Please press add button to create a stock`});
    const {averagePrice, balance} = asset;
    asset.averagePrice = (balance*averagePrice+quantity*purchasePrice)/(balance + quantity);
    asset.balance += quantity;
    await asset.save();
    
    let stockHistoryData = fs.readFileSync('./datas/stocksHistory.json').toString();
    stockHistoryData = JSON.parse(stockHistoryData);
    stockHistoryData.push({
        ticker, purchasePrice, quantity, dateOfPurchase : new Date(), user, 
    })
    fs.writeFileSync('./datas/stocksHistory.json', JSON.stringify(stockHistoryData));
    return res.send({asset, purchasePrice, quantity});
})

router.post('/coin/:coinName/buy', setAuth, async(req, res) => {
    const user = req.user;
    const {coinName} = req.params;

    const purchasePrice = Number(req.body.purchasePrice);
    const quantity = Number(req.body.quantity);
    
    const asset = await Asset.findOne({user, name : coinName});
    if(!asset) return res.status(404).send({error : `${coinName} not registered by now. Please press add button to create a coin`})
    console.log(asset);
    const {averagePrice, balance} = asset;
    asset.averagePrice = (balance*averagePrice + quantity*purchasePrice) / (balance + quantity);
    asset.balance += quantity;
    await asset.save();

    let coinHistoryData = fs.readFileSync('./datas/coinsHistory.json').toString();
    coinHistoryData = JSON.parse(coinHistoryData);
    coinHistoryData.push({
        name : coinName, purchasePrice, quantity, dataOfPurchase : new Date(), user,
    });
    fs.writeFileSync('./datas/coinsHistory.json', JSON.stringify(coinHistoryData));
    return res.send({asset, purchasePrice, quantity});
s})

// selling stocks
router.post('/stock/:ticker/sell', setAuth, async(req, res)=>{
    const user = req.user;
    const {ticker} =req.params;
    const sellPrice = Number(req.body.sellPrice);
    const quantity = Number(req.body.quantity);
    
    const asset = await Asset.findOne({user, ticker});
    const {balance, averagePrice} = asset;
    if(balance-quantity<0)  return res.status(400).send({error: 'You don\'t have enough stocks.'});
    else asset.balance -= quantity;
    await asset.save();
    let stockHistoryData = fs.readFileSync('./datas/stocksHistory.json').toString();
    stockHistoryData = JSON.parse(stockHistoryData);
    stockHistoryData.push({
        ticker, sellPrice, quantity, dateOfSell : new Date(), user, 
    });
    fs.writeFileSync('./datas/stocksHistory.json', JSON.stringify(stockHistoryData));
    return res.send({asset, sellPrice, quantity, averagePrice});
})

router.post('/coin/:coinName/sell', setAuth, async(req, res)=> {
    const user = req.user;
    const {coinName} = req.params;

    const sellPrice = Number(req.body.sellPrice);
    const quantity = Number(req.body.quantity);
    
    const asset = await Asset.findOne({user, name :coinName});
    if(!asset)  return res.status(404).send({error : `There is no such coin '${coinName}'`});
    const {balance, averagePrice} = asset;
    if(balance-quantity<0)  return res.status(400).send({error : 'You dont\'t have enough coins.'});
    else asset.balance -= quantity;
    await asset.save();
    
    let coinHistoryData = fs.readFileSync('./datas/coinsHistory.json').toString();
    coinHistoryData = JSON.parse(coinHistoryData);
    coinHistoryData.push({
        name : coinName, sellPrice, quantity, dataOfSell : new Date(), user,
    })
    fs.writeFileSync('./datas/coinsHistory.json', JSON.stringify(coinHistoryData));
    return res.send({asset, sellPrice, quantity, averagePrice})
})

module.exports = router;