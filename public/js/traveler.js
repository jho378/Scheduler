// const countries = ["Sea","Canada","Greenland","Russia","Norway","United States","Finland","Sweden","Iceland","United Kingdom","Estonia","Denmark","Lithuania","Latvia","Belarus","Ireland","Germany","Poland","Kazakhstan","Netherlands","Ukraine","China","France","Luxembourg","Czechia","Mongolia","Austria","Slovakia","Hungary","Moldova","Italy","Slovenia","Croatia","Serbia","Romania","Bosnia and Herzegovina","Uzbekistan","Japan","Spain","Albania","North Macedonia","Bulgaria","Turkey","Georgia","Turkmenistan","Kyrgyzstan","North Korea","Portugal","Greece","Azerbaijan","Iran","Tajikistan","South Korea","Algeria","Tunisia","Malta","Syria","Iraq","Afghanistan","Pakistan","Morocco","Lebanon","India","Mexico","Libya","Jordan","Saudi Arabia","Egypt","Nepal","Bhutan","Myanmar","Sahrawi Arab Democratic Republic","Mauritania","United Arab Emirates","Taiwan","The Bahamas","Mali","Oman","Bangladesh","Cuba","Niger","Chad","Sudan","Laos","Vietnam","Dominican Republic","Thailand","Luzon","Belize","Jamaica","Haiti","Yemen","Philippines","Guatemala","Honduras","Cape Verde","Senegal","Eritrea","Nicaragua","Burkina Faso","Ethiopia","Cambodia","Colombia","Venezuela","Grenada","Guinea-Bissau","Guinea","Nigeria","Costa Rica","Côte d'Ivoire","Ghana","Benin","Cameroon","Central African Republic","South Sudan","Somalia","Sri Lanka","Visayas","Federated States of Micronesia","Marshall Islands","Panama","Guyana","Sierra Leone","Liberia","Suriname","Malaysia","Brazil","Democratic Republic of the Congo","Democratic Republic of Congo","Uganda","Kenya","Indonesia","Palau","Equatorial Guinea","Gabon","Congo-Brazzaville","Ecuador","Congo","Peru","Rwanda","Tanzania","Papua New Guinea","Burundi","Angola","Solomon Islands","Kiribati","Bolivia","Zambia","Malawi","Australia","Mozambique","Samoa","Madagascar","Vanuatu","Tonga","Zimbabwe","Namibia","Fiji","Cook Islands","Chile","Paraguay","Botswana","Argentina","South Africa","Eswatini","Lesotho","Uruguay","New Zealand","Falkland Islands","Antarctica"];


const countries = document.querySelectorAll('.country');
const sea = document.querySelectorAll('.Sea');

const hoverCountry = (event) => {
    let country = event.target.classList[1];
    console.log(country)
    console.log(event)
    country = country.replaceAll(' ', '_');
    console.log(country);
    const countryMouseOn = document.querySelectorAll(`.${country}`);
    console.log(countryMouseOn);
    countryMouseOn.forEach(e => e.classList.add('active'));
}

const unhoverCountry = (event) => {
    console.log(event.target.classList[1]);
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
    if(controlSpan.innerText==="Color visited countries") controlSpan.innerText = "Discolor visitied countries";
    else controlSpan.innerText = "Color visited countries"; 
}
controlInput.addEventListener('click', changeControlSpan);


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
