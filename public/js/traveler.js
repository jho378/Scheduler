const fs =require('fs');
const axios = require('axios');
const API_KEY = `fb76836f62cc4e7781941e901500dc9b`;
const MAX_LAT = 90;
const MAX_LON = 180;
const scale = 2;

const Map = async () => {
    let map = fs.readFileSync('../../datas/map.json');
    map = JSON.parse(map);

    const lon = map[map.length-1].length * scale - MAX_LON;
    const lat = MAX_LAT - (map.length * scale);

    if(lon === MAX_LON){
        if(lat > -MAX_LAT){
            map.push([]);
            fs.writeFileSync('../../datas/map.json', JSON.stringify(map));
            Map();
            return ; 
        }
    }
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${API_KEY}`;

    const mapData = await axios.get(url).then(res => res.data).then(result => result.results[0].country).then(country => {
        console.log(lat, lon, country);
        if(country) map[map.length-1].push(country);
        else map[map.length-1].push('Sea');
    });
    fs.writeFileSync('../../datas/map.json', JSON.stringify(map));
    Map();
}
Map();