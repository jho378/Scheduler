// countries = ['Canada', 'Greenland', 'Russia', 'Norway', 'United_States', 'Finland', 'Sweden', 'Iceland', 'United_Kingdom', 'Estonia', 'Denmark', 'Lithuania', 'Latvia', 'Belarus', 'Ireland', 'Germany', 'Poland', 'Kazakhstan', 'Netherlands', 'Ukraine', 'China', 'France', 'Belgium', 'Luxembourg', 'Czech', 'Mongolia', 'Switzerland', 'Liechtenstein', 'Austria', 'Slovakia', 'Hungary', 'Moldova', 'Italy', 'Slovenia', 'Croatia', 'Serbia', 'Romania', 'Monaco', 'San_Marino', 'Bosnia_and_Herzegovina', 'Montenegro', 'Kosovo', 'Uzbekistan', 'Japan', 'Spain', 'Vatican_City', 'Albania', 'North_Macedonia', 'Bulgaria', 'Turkey', 'Georgia', 'Turkmenistan', 'Kyrgyzstan', 'North_Korea', 'Portugal', 'Greece', 'Armenia', 'Azerbaijan', 'Iran', 'Tajikistan', 'South_Korea', 'Algeria', 'Tunisia', 'Malta', 'Syria', 'Iraq', 'Afghanistan', 'Pakistan', 'Morocco', 'Cyprus', 'Lebanon', 'India', 'Mexico', 'Libya', 'Jordan', 'Saudi_Arabia', 'Egypt', 'Israel', 'Nepal', 'Kuwait', 'Bhutan', 'Myanmar', 'Sahrawi_Arab_Democratic_Republic', 'Mauritania', 'Qatar', 'Bahrain', 'United_Arab_Emirates', 'Taiwan', 'The_Bahamas', 'Mali', 'Oman', 'Bangladesh', 'Cuba', 'Niger', 'Chad', 'Sudan', 'Laos', 'Vietnam', 'Dominican_Republic', 'Thailand', 
// 'Philippines', 'Belize', 'Jamaica', 'Haiti', 'Antigua_and_Barbuda', 'Saint_Kitts_and_Nevis', 'Yemen', 'Guatemala', 'Honduras', 'Dominica', 'Cape_Verde', 'Senegal', 'Eritrea', 'El_Salvador', 'Nicaragua', 'Saint_Lucia', 'Gambia', 'Burkina_Faso', 'Ethiopia', 'Cambodia', 'Colombia', 'Venezuela', 'Grenada', 'Saint_Vincent_and_the_Grenadines', 'Barabdos', 'Guinea-Bissau', 'Guinea', 'Nigeria', 'Costa_Rica', 'Trinidad_and_Tobago', 'Côte_d', 'Ghana', 'Benin', 'Cameroon', 'Central_African_Republic', 'South_Sudan', 'Somalia', 'Sri_Lanka', 'Micronesia', 'Marshall_Islands', 'Panama', 'Guyana', 'Sierra_Leone', 'Liberia', 'Suriname', 'Togo', 'Malaysia', 'Brazil', 'Democratic_Republic_of_the_Congo', 'Uganda', 'Kenya', 'Maldives', 'Indonesia', 'Brunei', 'Palau', 'Equatorial_Guinea', 'Gabon', 'Congo-Brazzaville', 'Singapore', 'Ecuador', 'Peru', 'Rwanda', 'Tanzania', 'Seychelles', 'Papua_New_Guinea', 'Burundi', 'Angola', 'East_Timor', 'Solomon_Islands', 'Kiribati', 'Bolivia', 'Zambia', 'Malawi', 'Australia', 'Nauru', 'Mozambique', 'Samoa', 'Comoros', 'Madagascar', 'Vanuatu', 'Tuvalu', 'Tonga', 'Zimbabwe', 'Namibia', 'Mauritius', 'Fiji', 'Cook_Islands', 'Chile', 'Paraguay', 'Botswana', 'Argentina', 'South_Africa', 'Swaziland', 'Lesotho', 'Uruguay', 'New_Zealand', 'Falkland_Islands', 'Antarctica']


const countries = document.querySelectorAll('.country');
const sea = document.querySelectorAll('.Sea');

const hoverCountry = (event) => {
    let country = event.target.classList[1];
    // console.log(country)
    // console.log(event)
    country = country.replaceAll(' ', '_');
    // console.log(country);
    const countryMouseOn = document.querySelectorAll(`.${country}`);
    // console.log(countryMouseOn);
    countryMouseOn.forEach(e => e.classList.add('active'));
}

const unhoverCountry = (event) => {
    // console.log(event.target.classList[1]);
    let country = event.target.classList[1];
    country = country.replaceAll(' ', '_');
    const countryMouseOut = document.querySelectorAll(`.${country}`);
    countryMouseOut.forEach(e => e.classList.remove('active'));
}
countries.forEach(e => e.addEventListener('mouseover', hoverCountry));
countries.forEach(e => e.addEventListener('mouseout', unhoverCountry));

// const controlSpan = document.querySelector('.controlBtn span');
const controlInput = document.querySelector('.controlBtn input');

const changeControlSpan = (event) => {
    const controlSpan = document.querySelector('.controlBtn span');
    if(controlSpan.innerText==="Color visited countries") controlSpan.innerText = "Clear the map";
    else controlSpan.innerText = "Color visited countries"; 
}
controlInput.addEventListener('click', changeControlSpan);

// tooltip 추가 로직

const map = document.querySelector('.map');
const tooltip = document.querySelector('#tooltip');

const popUpTooltip = (event) => {
    const tgt = event.target;
    console.log(event)
    console.log(event.target)
    // if(tgt.classList.contains('Sea')){
    //     tooltip.style.visibility = "hidden";
    // }
    
    const country = event.target.classList[1];
    if (country === undefined){
        tooltip.style.visibility = "hidden";
    }   else {
        tooltip.style.visibility = "visible";
    }
    const x = event.clientX;
    const y = event.clientY;
    tooltip.style.top = (y/16 + 0.5) + "rem";
    tooltip.style.left = (x/16 + 0.5) + "rem";
    
    tooltip.innerText = country;
    
    // if(country===undefined) tooltip.style.visibility = hidden;
    // else tooltip.innerText = country;
    
}
map.addEventListener('mousemove', popUpTooltip);


// const fs =require('fs');

// let mapData = fs.readFileSync('../../datas/map.json');
// mapData = JSON.parse(mapData);
// for(let i=0; i<90; i++){
//     for(let j=0; j<180; j++){
//         if(mapData[i][j]==='Sea')   mapData[i][j] = `<div class='Sea'></div>`
//         else{
//             mapData[i][j] = mapData[i][j].replaceAll(" ", "_");
//             mapData[i][j] = `<div class='country ${mapData[i][j]}'></div>`;
//         }
//     }
// }
// for(let i=0; i<90; i++){
//     mapData[i] = mapData[i].join('\n');
// }

// const maps = mapData.join('\n');
// fs.writeFileSync('../../datas/maps.json', maps)
