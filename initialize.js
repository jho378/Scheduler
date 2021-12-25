const {Asset, Book, Coin, Key, Stock, User} = require('./models');
const axios = require('axios');
const cheerio = require('cheerio');
let start = 0;
let end = 0;
const init = async() => {
    start = new Date();
    await Asset.deleteMany();
    await Book.deleteMany();
    await Coin.deleteMany();
    await Key.deleteMany();
    await Stock.deleteMany();
    await User.deleteMany();
    await Schedule.deleteMany();

    const coins = ['bitcoin', 'ethereum', 'dogecoin', 'ripple', 'solana'];
    const stocks = ['COST', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NKE', 'IONQ', 'PLTR', 'SBUX', 'AAPL', 'KO', 'JPM','BRK-B', 'AXP', 'O', 'PG', 'ABNB'];
    // maybe add ETF later;
    // https://companiesmarketcap.com/assets-by-market-cap/
    const stockNames = [];
    const stockSectors = [];
    const stockIndustries = [];
    for(const _coin of coins){
        const coin = new Coin({name : _coin, sector: 'Crypto', industry : 'Crypto', isActive : true});
        await coin.save();
    }
    console.log('coins initialization completed');

    const getMainHTML = async(ticker) => {
        try{
            return await axios.get(`https://finance.yahoo.com/quote/${ticker}`);
        }   catch(err){
            console.log({error : 'Error occured when parsing main html'});
        }
    }
    
    const parsing = async(ticker) => {
        const html = await getMainHTML(ticker);
        const $ = cheerio.load(html.data);
        const $price = $("#quote-header-info");
        $price.each((idx, node) => {
            const priceText = $(node).text();
            const stockName = priceText.slice(0, priceText.indexOf('(')-1);
            console.log(stockName);
            stockNames.push(stockName);
        })
    }

    const getSubHTML = async(ticker) => {
        try{
            return await axios.get(`https://finance.yahoo.com/quote/${ticker}/profile?p=${ticker}`);
        }   catch(err){
            console.log({error : 'Error occured when parsing sub html'});
        }
    }

    const subParsing = async(ticker) => {
        const html = await getSubHTML(ticker);
        const $ = cheerio.load(html.data);
        const $field = $(".asset-profile-container");
        $field.each((idx, node) => {
            const fieldText = $(node).text();
            const fieldArr = fieldText.split('Industry');
            const sector = fieldArr[0].slice(fieldArr[0].indexOf("):") + 3);
            const industry = fieldArr[1].slice(2, fieldArr[1].indexOf('Full Time'))
            stockSectors.push(sector);
            stockIndustries.push(industry);
        })
    }

    for(const _stock of stocks){
        try{
        await parsing(_stock);
        await subParsing(_stock);
        const stock = new Stock({name : stockNames[stockNames.length -1],
            ticker : _stock,
            sector : stockSectors[stockSectors.length-1],
            industry : stockIndustries[stockIndustries.length -1],
            isActive : true});
        await stock.save();
        }   catch(err){
            console.log({error: 'Might have typed wrong ticker'});
        }
    }
    
    console.log('stocks initialization completed');   
    end = new Date(); 
    console.log(end - start);
}

init();

// done by now 
// 나중에 update하고 싶을떄 여기서 돌리면 재앙이야 나중에 update 할때 따로 만들어서 하세요 