const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const {Asset, Book, Coin, Key, Stock, User, Schedule, Workout} = require('./models');
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
    await Workout.deleteMany();
    fs.writeFileSync('./datas/stocks.json', JSON.stringify([]));
    fs.writeFileSync('./datas/coins.json', JSON.stringify([]));
    fs.writeFileSync('./datas/workouts.json', JSON.stringify([]));
    const coins = ['bitcoin', 'ethereum', 'dogecoin', 'ripple', 'solana'];
    const stocks = ['COST', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NKE', 'IONQ', 'PLTR', 'SBUX', 'AAPL', 'KO', 'JPM','BRK-B', 'AXP', 'O', 'PG', 'ABNB'];
   
    const chest = ['Bench press', 'Incline bench press', 'Dumbell bench press', 'Incline dumbell press', 'Dips', 'Dumbell fly', 'Cable crossover', 'Pec deck fly', 'Push-up', 'Incline Dumbell fly', 'Dumbell pullover'];
    const back = ['Pull-up', 'Barbell row', 'Dumbell row', 'Seated row', 'Lat pulldown', 'Chin-up', 'Deadlift', 'One arm dumbell row', 'Back extension'];
    const shoulder = ['Overhead dumbell press', 'Overhead barbell press', 'Side lateral raise', 'Front raise', 'Behind neck press', 'Bentover dumbell lateral raise', 'Rear deltoid fly'];
    const arms = ['Dumbell curl', 'Dumbell hammer curl', 'Barbell curl', 'triceps dumbell extension', 'Dumbell kickback', 'Cable pushdown', 'Close grip push-up', 'Barbell preacher curl', 'Close grip bench press'];
    const abs = ['Sit up', 'Leg raise', 'Plank', 'Crunch', 'V-up', 'Hanging leg raise'];
    const legs = ['Leg curl', 'Leg extension', 'Conventional deadift', 'Squats', 'Leg press', 'Hip abduction', 'Hip deduction'];
    const cardio = ['Treadmill', 'Cycle', 'Rowing machine'];
    const workouts = [chest, back, shoulder, arms, abs, legs, cardio];

    const strWorkouts = ['chest', 'back', 'shoulder', 'arms', 'abs', 'legs', 'cardio'];
    workouts.forEach((part, idx) => {
        part.forEach(async exer => {
            const workout = new Workout({name : exer, part : strWorkouts[idx], weight : 1, set : 1, rep : 1, id : 0});
            await workout.save();
            let workoutData = fs.readFileSync('./datas/workouts.json').toString();
            workoutData = JSON.parse(workoutData);
            workoutData.push({name : exer, part : strWorkouts[idx]})
            fs.writeFileSync('./datas/workouts.json', JSON.stringify(workoutData));
        })
    })
    console.log('workouts initialization completed');
    // maybe add ETF later;
    // https://companiesmarketcap.com/assets-by-market-cap/
    
    for(const _coin of coins){
        const coin = new Coin({name : _coin, sector: 'Crypto', industry : 'Crypto', assetType : 'cryptocoin', isActive : true});
        let coinsJson = fs.readFileSync('./datas/coins.json').toString();
        coinsJson = JSON.parse(coinsJson);
        coinsJson.push({name : _coin, sector : 'Crypto', industry : 'Crypto'});
        fs.writeFileSync('./datas/coins.json', JSON.stringify(coinsJson));
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