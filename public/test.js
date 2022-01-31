const axios = require('axios');
const API_KEY = "SIVW0FicOT9i0Z7yMpKR6lgdVyQxObWz";

const dividends = document.querySelector('.dividend');

const stocks = ['AAPL', 'O', 'T', 'KO']
const dividend = async (ticker) => {
    const _datas = await axios.get(`https://api.polygon.io/v3/reference/dividends?${ticker}=O&apiKey=${API_KEY}`);
    const datas = _datas.data.results;
    const upcomingDividend = datas[0]['cash_amount']
    console.log(upcomingDividend);
    dividends.innerText += `${ticker} : ${upcomingDividend}`;
}
dividend();
stocks.forEach(tick => dividend(tick));