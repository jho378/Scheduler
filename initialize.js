const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const {Asset, Book, Coin, Key, Stock, User, Schedule} = require('./models');
const {getMainHTML, parsing, getSubHTML, subParsing} = require('./utils');
let start = 0;
let end = 0;
// this is for test
const init = async() => {
    start = new Date();
    await Asset.deleteMany();
    await Book.deleteMany();
    await Coin.deleteMany();
    await Key.deleteMany();
    await Stock.deleteMany();
    await User.deleteMany();
    await Schedule.deleteMany();    
    fs.writeFileSync('./datas/stocks.json', JSON.stringify([]));
    const coins = ['bitcoin', 'ethereum', 'dogecoin', 'ripple', 'solana'];
    const stocks = ['COST', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NKE', 'IONQ', 'PLTR', 'SBUX', 'AAPL', 'KO', 'JPM','BRK-B', 'AXP', 'O', 'PG', 'ABNB'];
    // maybe add ETF later;
    // https://companiesmarketcap.com/assets-by-market-cap/
    
    for(const _coin of coins){
        const coin = new Coin({name : _coin, sector: 'Crypto', industry : 'Crypto', assetType : 'cryptocoin', isActive : true});
        await coin.save();
    }
    console.log('coins initialization completed');

    for(const _stock of stocks){
        // try{
        await parsing(_stock);
        await subParsing(_stock);
        // }   catch(err){
        //     console.log({error: 'Might have typed wrong ticker'});
        // }
        // later, test if getting values from datas/json works
    }

    let stocksJson = fs.readFileSync('./datas/stocks.json').toString();
    stocksJson = JSON.parse(stocksJson);
    stocksJson.forEach(async e => {
        const stock = new Stock({
            name : e.name,
            ticker : e.ticker,
            sector : e.sector,
            industry : e.industry,
            assetType : "stock",
            isActive : true,    
        });
        await stock.save();
    })
    
    console.log('stocks initialization completed');   
    end = new Date(); 
    console.log(end - start);
}

init();

// done by now 21.12.27