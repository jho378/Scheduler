const toggleBtn = document.querySelector('.navbar_toggleBtn');
const menu = document.querySelector('.navbar_menu');
const icons = document.querySelector('.navbar_icons');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
})

const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

let now = new Date();

const renderCalendar = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    document.querySelector('.cal_year-month').textContent =`${currentYear} ${month[currentMonth]}`;
    
    const prevLast = new Date(currentYear, currentMonth, 0);
    const thisLast = new Date(currentYear, currentMonth+1, 0);
    
    const plDate = prevLast.getDate();
    const plDay = prevLast.getDay();
    const tlDate = thisLast.getDate();
    const tlDay = thisLast.getDay();
    
    const prevDates = [];
    const thisDates = [...Array(tlDate+1).keys()].slice(1);
    const nextDates = [];

    if(plDay!==6){
        for(let i=0; i<plDay+1; i++)    prevDates.unshift(plDate - i);
    }
    for(let i=1; i<7-tlDay; i++)    nextDates.push(i);
    
    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(tlDate);
    dates.forEach((date, i) => {
        const condition = i>= firstDateIndex && i<lastDateIndex +1 ? 'this' : 'other';
        dates[i] = `<div class='date'><span class='${condition}'>${date}</span></div>`;
    })
    // inserting htmls made above to the 64th line of index.html
    document.querySelector('.dates').innerHTML = dates.join('');
    
    const today = new Date();
    if(currentMonth === today.getMonth() && currentYear === today.getFullYear()){
        for (let date of document.querySelectorAll('.this')){
            if (+date.innerText === today.getDate()){
                date.classList.add('today');
                break;
            }
        }
    }
}

// 이걸 아마도 main.js에서 처리하면 안되고 나중에 import해서 처리해야 하는 모양이에요 
const URLSearch = location.pathname.split('/');

if(URLSearch[1].length===0){
    console.log(URLSearch[1])
    renderCalendar();
}
else{   
    let tmp = month.indexOf(URLSearch[1]);
    console.log(URLSearch[1])
    now.setDate(1);
    now.setMonth(tmp);
    renderCalendar();
}
