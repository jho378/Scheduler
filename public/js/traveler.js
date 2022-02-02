const fs = require('fs');

// const map = document.querySelector('.map');
let countries = ["Sea","Canada","Greenland","Russia","Norway","United States","Finland","Sweden","Iceland","United Kingdom","Estonia","Denmark","Lithuania","Latvia","Belarus","Ireland","Germany","Poland","Kazakhstan","Netherlands","Ukraine","China","France","Luxembourg","Czechia","Mongolia","Austria","Slovakia","Hungary","Moldova","Italy","Slovenia","Croatia","Serbia","Romania","Bosnia and Herzegovina","Uzbekistan","Japan","Spain","Albania","North Macedonia","Bulgaria","Turkey","Georgia","Turkmenistan","Kyrgyzstan","North Korea","Portugal","Greece","Azerbaijan","Iran","Tajikistan","South Korea","Algeria","Tunisia","Malta","Syria","Iraq","Afghanistan","Pakistan","Morocco","Lebanon","India","Mexico","Libya","Jordan","Saudi Arabia","Egypt","Nepal","Bhutan","Myanmar","Sahrawi Arab Democratic Republic","Mauritania","United Arab Emirates","Taiwan","The Bahamas","Mali","Oman","Bangladesh","Cuba","Niger","Chad","Sudan","Laos","Vietnam","Dominican Republic","Thailand","Luzon","Belize","Jamaica","Haiti","Yemen","Philippines","Guatemala","Honduras","Cape Verde","Senegal","Eritrea","Nicaragua","Burkina Faso","Ethiopia","Cambodia","Colombia","Venezuela","Grenada","Guinea-Bissau","Guinea","Nigeria","Costa Rica","Côte d'Ivoire","Ghana","Benin","Cameroon","Central African Republic","South Sudan","Somalia","Sri Lanka","Visayas","Federated States of Micronesia","Marshall Islands","Panama","Guyana","Sierra Leone","Liberia","Suriname","Malaysia","Brazil","Democratic Republic of the Congo","Democratic Republic of Congo","Uganda","Kenya","Indonesia","Palau","Equatorial Guinea","Gabon","Congo-Brazzaville","Ecuador","Congo","Peru","Rwanda","Tanzania","Papua New Guinea","Burundi","Angola","Solomon Islands","Kiribati","Bolivia","Zambia","Malawi","Australia","Mozambique","Samoa","Madagascar","Vanuatu","Tonga","Zimbabwe","Namibia","Fiji","Cook Islands","Chile","Paraguay","Botswana","Argentina","South Africa","Eswatini","Lesotho","Uruguay","New Zealand","Falkland Islands","Antarctica"]

let mapData = fs.readFileSync('../../datas/map.json');
mapData = JSON.parse(mapData);
for(let i=0; i<90; i++){
    for(let j=0; j<180; j++){
        if(!countries.includes(`"${mapData[i][j]}"`)) countries.push(`"${mapData[i][j]}"`)
        if(mapData[i][j]==='Sea')   mapData[i][j] = `<div class='country' id='Sea'></div>`
        else mapData[i][j] = `<div class='country' id=${mapData[i][j]}></div>`;
    }
}

for(let i=3; i<90; i++){
    mapData[i] = mapData[i].join('\n');
}
const _arr = mapData.slice(3, 77);
const __arr = mapData.slice(77);
const res = __arr.concat(_arr);
const maps = res.join('\n');

fs.writeFileSync('../../datas/maps.json',String(countries));
// fs.writeFileSync('../../datas/maps.json', maps)
