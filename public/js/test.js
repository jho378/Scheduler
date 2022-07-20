// const axios = require('axios');
// const API_KEY = "SIVW0FicOT9i0Z7yMpKR6lgdVyQxObWz";

// const dividends = document.querySelector('.dividend');

// const stocks = ['AAPL', 'O', 'T', 'KO']
// const dividend = async (ticker) => {
//     const _datas = await axios.get(`https://api.polygon.io/v3/reference/dividends?${ticker}=O&apiKey=${API_KEY}`);
//     const datas = _datas.data.results;
//     const upcomingDividend = datas[0]['cash_amount']
//     console.log(upcomingDividend);
//     dividends.innerText += `${ticker} : ${upcomingDividend}`;
// }
// dividend();
// stocks.forEach(tick => dividend(tick));


// countries = ['Canada', 'Greenland', 'Russia', 'Norway', 'United_States', 'Finland', 'Sweden', 'Iceland', 'United_Kingdom', 'Estonia', 'Denmark', 'Lithuania', 'Latvia', 'Belarus', 'Ireland', 'Germany', 'Poland', 'Kazakhstan', 'Netherlands', 'Ukraine', 'China', 'France', 'Belgium', 'Luxembourg', 'Czech', 'Mongolia', 'Switzerland', 'Liechtenstein', 'Austria', 'Slovakia', 'Hungary', 'Moldova', 'Italy', 'Slovenia', 'Croatia', 'Serbia', 'Romania', 'Monaco', 'San_Marino', 'Bosnia_and_Herzegovina', 'Montenegro', 'Kosovo', 'Uzbekistan', 'Japan', 'Spain', 'Vatican_City', 'Albania', 'North_Macedonia', 'Bulgaria', 'Turkey', 'Georgia', 'Turkmenistan', 'Kyrgyzstan', 'North_Korea', 'Portugal', 'Greece', 'Armenia', 'Azerbaijan', 'Iran', 'Tajikistan', 'South_Korea', 'Algeria', 'Tunisia', 'Malta', 'Syria', 'Iraq', 'Afghanistan', 'Pakistan', 'Morocco', 'Cyprus', 'Lebanon', 'India', 'Mexico', 'Libya', 'Jordan', 'Saudi_Arabia', 'Egypt', 'Israel', 'Nepal', 'Kuwait', 'Bhutan', 'Myanmar', 'Sahrawi_Arab_Democratic_Republic', 'Mauritania', 'Qatar', 'Bahrain', 'United_Arab_Emirates', 'Taiwan', 'The_Bahamas', 'Mali', 'Oman', 'Bangladesh', 'Cuba', 'Niger', 'Chad', 'Sudan', 'Laos', 'Vietnam', 'Dominican_Republic', 'Thailand', 
// 'Philippines', 'Belize', 'Jamaica', 'Haiti', 'Antigua_and_Barbuda', 'Saint_Kitts_and_Nevis', 'Yemen', 'Guatemala', 'Honduras', 'Dominica', 'Cape_Verde', 'Senegal', 'Eritrea', 'El_Salvador', 'Nicaragua', 'Saint_Lucia', 'Gambia', 'Burkina_Faso', 'Ethiopia', 'Cambodia', 'Colombia', 'Venezuela', 'Grenada', 'Saint_Vincent_and_the_Grenadines', 'Barabdos', 'Guinea-Bissau', 'Guinea', 'Nigeria', 'Costa_Rica', 'Trinidad_and_Tobago', 'Côte_d', 'Ghana', 'Benin', 'Cameroon', 'Central_African_Republic', 'South_Sudan', 'Somalia', 'Sri_Lanka', 'Micronesia', 'Marshall_Islands', 'Panama', 'Guyana', 'Sierra_Leone', 'Liberia', 'Suriname', 'Togo', 'Malaysia', 'Brazil', 'Democratic_Republic_of_the_Congo', 'Uganda', 'Kenya', 'Maldives', 'Indonesia', 'Brunei', 'Palau', 'Equatorial_Guinea', 'Gabon', 'Congo-Brazzaville', 'Singapore', 'Ecuador', 'Peru', 'Rwanda', 'Tanzania', 'Seychelles', 'Papua_New_Guinea', 'Burundi', 'Angola', 'East_Timor', 'Solomon_Islands', 'Kiribati', 'Bolivia', 'Zambia', 'Malawi', 'Australia', 'Nauru', 'Mozambique', 'Samoa', 'Comoros', 'Madagascar', 'Vanuatu', 'Tuvalu', 'Tonga', 'Zimbabwe', 'Namibia', 'Mauritius', 'Fiji', 'Cook_Islands', 'Chile', 'Paraguay', 'Botswana', 'Argentina', 'South_Africa', 'Swaziland', 'Lesotho', 'Uruguay', 'New_Zealand', 'Falkland_Islands', 'Antarctica']
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadFile = async (fileUrl, downloadFolder) => {
    const fileName = path.basename(fileUrl);
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);

    try{
        const response = await axios({
            method : "GET",
            url : fileUrl, 
            responseType : "stream",
        })
        const w = response.data.pipe(fs.createWriteStream(localFilePath));
        w.on('finish', () => {
            console.log('Successfully downloaded image!');
        })
    }
    catch(err){
        throw new Error(err);
    }
}

const IMAGE_URL = 'http://image.kyobobook.co.kr/images/book/large/488/l9788937434488.jpg';
downloadFile(IMAGE_URL, '../img');