const toggleBtn = document.querySelector('.navbar_toggleBtn');
const menu = document.querySelector('.navbar_menu');
const icons = document.querySelector('.navbar_icons');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
});

const month = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
];

let now = new Date();

const renderCalendar = () => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    console.log("this is", now)
    document.querySelector(
        '.cal_year-month'
    ).textContent = `${currentYear} ${month[currentMonth]}`;

    const prevLast = new Date(currentYear, currentMonth, 0);
    const thisLast = new Date(currentYear, currentMonth + 1, 0);

    const plDate = prevLast.getDate();
    const plDay = prevLast.getDay();
    const tlDate = thisLast.getDate();
    const tlDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(tlDate + 1).keys()].slice(1);
    const nextDates = [];

    if (plDay !== 6) {
        for (let i = 0; i < plDay + 1; i++) prevDates.unshift(plDate - i);
    }
    for (let i = 1; i < 7 - tlDay; i++) nextDates.push(i);

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(tlDate);
    if(dates.length===35){
        dates.forEach((date, i) => {
            const condition =
                i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';
            dates[
                i
            ] = `<div class='date fiveweeks'><span class='${condition}'>${date}</span></div>`;
        });
        document.querySelector('.dates').classList.add('fiveweeks')
        document.querySelector('.dates').innerHTML = dates.join('');
    }
    if(dates.length===42){
        dates.forEach((date, i) => {
            const condition =
                i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';
            dates[
                i
            ] = `<div class='date sixweeks'><span class='${condition}'>${date}</span></div>`;
        });
        document.querySelector('.dates').classList.add('sixweeks')
        document.querySelector('.dates').innerHTML = dates.join('');
    }

    // inserting htmls made above to the 64th line of index.html

    const today = new Date();
    if (
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
    ) {
        for (let date of document.querySelectorAll('.this')) {
            if (+date.innerText === today.getDate()) {
                date.classList.add('today');
                break;
            }
        }
    }
};

// 이걸 아마도 main.js에서 처리하면 안되고 나중에 import해서 처리해야 하는 모양이에요
const URLSearch = location.pathname.split('/');
console.log(URLSearch)
// localhost:3000/  , 즉 뒤에 아무것도 안 붙었을 때 이것도 나중에 바꿔줘야함. 
if (URLSearch[1].length === 0) {
    now = new Date();
    renderCalendar();
}   else {    
    const yr = Number(URLSearch[1]);
    const mth = month.indexOf(URLSearch[2]);
    now.setYear(yr);
    console.log(yr, mth)
    now.setMonth(mth); 
    now.setDate(1);
    renderCalendar();
}


// renderCalendar();

const dates = document.querySelector('.dates');
// if()

const handleDeleteClick = () => {
    const schedules = document.querySelectorAll('.schedule');

}
const deleteBtn = document.querySelector('.deleteList');
deleteBtn.addEventListener('click',handleDeleteClick);

const addBtn = document.querySelector('.addList');
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.modal_overlay');
const saveBtn = document.querySelector('.saveBtn');
const cancleBtn = document.querySelector('.cancelBtn');
const scheduleStartingDate = document.querySelector('#schedule_starting_date');
const scheduleFinishingDate = document.querySelector('#schedule_finishing_date');
const calYearMonth = document.querySelector('.cal_year-month');

const modalYr = calYearMonth.innerText.split(' ')[0];
const modalMth = calYearMonth.innerText.split(' ')[1];
 
const todayForModal = new Date();
const dateForModal = String(todayForModal).split(' ').slice(1,4);
const yrForModal = dateForModal[2];
const mthForModal = dateForModal[0];

if(modalYr === yrForModal && modalMth === mthForModal.toUpperCase()){
    console.log(modalYr, yrForModal, modalMth, mthForModal.toUpperCase())
    const dayForModal = dateForModal[1];
    const _modalMth = String(month.indexOf(modalMth) + 1);
    scheduleStartingDate.value = modalYr + '-' + _modalMth.padStart(2, "0") + '-' + dayForModal.padStart(2, "0");
    scheduleFinishingDate.value = modalYr + '-' + _modalMth.padStart(2, "0") + '-' + dayForModal.padStart(2, "0");
}
else {
    const _modalMth = String(month.indexOf(modalMth) + 1);
    scheduleStartingDate.value = modalYr + '-' + _modalMth.padStart(2, "0") + '-01';
    scheduleFinishingDate.value = modalYr + '-' + _modalMth.padStart(2, "0") + '-01';
}

// scheduleStartingDate.value = new Date().toISOString().substring(0, 10);
// scheduleFinishingDate.value = new Date().toISOString().substring(0, 10);

const date = document.querySelectorAll('.date');
const handleDateClick = (event) => {
    modal.classList.remove('hidden');
    const _calYearMonth = calYearMonth.innerText;
    const calYr = _calYearMonth.split(' ')[0];
    const calMth = String(month.indexOf(_calYearMonth.split(' ')[1]) + 1);
    const target = event.target.innerHTML; // span inside the div date 
    const targetDay = event.target.innerText;
    
    console.log(target.includes('other'));
    // 해당 페이지의 연 월이 아닐 경우, 다음달이나 저번달
    if(target.includes('other')){
        // 다음달
        if(Number(event.target.innerText)<10){
            // 12월일 경우, 다음 달이 내년
            if(calMth==='12'){
                scheduleStartingDate.value = String(Number(calYr)+1) + '-' + '01' + '-' + targetDay.padStart(2, '0');
                scheduleFinishingDate.value = String(Number(calYr)+1) + '-' + '01' + '-' + targetDay.padStart(2, '0');
            }   else{
            const nextMth = String(Number(calMth) + 1);
            console.log(nextMth);
            scheduleStartingDate.value = calYr + '-' + nextMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');
            scheduleFinishingDate.value = calYr + '-' + nextMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');    
            }
        } 
        // 저번 달
        else{
            // 저번 달이 작년, 현재1월
            if(calMth === '01'){
                scheduleStartingDate.value = String(Number(calYr - 1)) + '-' + '12' + '-' + targetDay.padStart(2, '0');
                scheduleFinishingDate.value = String(Number(calYr - 1)) + '-' + '12' + '-' + targetDay.padStart(2, '0');
            } else {
                const prevMth = String(Number(calMth) - 1)
                scheduleStartingDate.value = calYr + '-' + prevMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');
                scheduleFinishingDate.value = calYr + '-' + prevMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');    
            }
        }
    }   
    // 실제 현재 있는 페이지의 연월일 경우
    else{
        scheduleStartingDate.value = calYr + '-' + calMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');
        scheduleFinishingDate.value = calYr + '-' + calMth.padStart(2, '0') + '-' + targetDay.padStart(2, '0');
    }
    
    
}
date.forEach(e => e.addEventListener('click', handleDateClick));

// 더블 클릭 방지
const preventDoubleClick = () => {
    saveBtn.setAttribute('disabled', 'disabled');
    saveBtn.value = 'Submitting... Please wait...'
}

const calendarForm = document.querySelector('#calendarForm');
calendarForm.addEventListener('submit', preventDoubleClick);


saveBtn.addEventListener("keyup", (event)=> {
    if(event.keyCode===13){
        event.preventDefault();
        saveBtn.click();
    }
})


const synchronizeFinishDate = () => {
    scheduleFinishingDate.value = scheduleStartingDate.value;
}
scheduleStartingDate.addEventListener('change', synchronizeFinishDate);

const openAddModal = () => {
    modal.classList.remove('hidden')
}
const closeAddModal = () => {
    modal.classList.add('hidden');
}

overlay.addEventListener('click', closeAddModal);
cancleBtn.addEventListener('click', closeAddModal);
addBtn.addEventListener('click', openAddModal);

const addMustDoList = document.querySelector('.addmustdolist');

const handleAddMustDoList = (event) => {
    const mustDoList = document.querySelectorAll('#mustdolist');
    if(mustDoList[0].innerText.length===0) mustDoList[0].innerText = 'hello';
    else if(mustDoList[1].innerText.length===0) mustDoList[1].innerText = 'hello';
    else if(mustDoList[2].innerText.length===0) mustDoList[2].innerText = 'hello';
    else alert('maximum of 3 must-do-lists permitted');
}
addMustDoList.addEventListener('click', handleAddMustDoList)

let schedules = [];
let str = "";

const calYr = calYearMonth.innerText.split(' ')[0];
const calMth = calYearMonth.innerText.split(' ')[1];
console.log(calYr, calMth)
fetch(`/hidden/${calYr}/${calMth}`).then(res => res.json()).then((json) => json.forEach(schedule => {
    
    const date = schedule.date;
    const title = schedule.title;
    const description = schedule.description;
    let _date = String(schedule.date);

    const _mth = Number(_date.slice(5,7));
    _date = _date.slice(8, 10);

    _date = String(Number(_date));
    // const day = String(parseInt(_day));
    const dates = document.querySelectorAll('.date');
    const datesSpan = document.querySelectorAll('.date span');
    
    // console.log(dates);
    for(let i=0; i<dates.length; i++){
        const det = dates[i].innerText.split('\n')[0];

        if(dates[i].firstChild.classList.contains('this')){
            if(det===_date && month.indexOf(calMth) + 1 === _mth){
                dates[i].innerHTML += `<ul><li class="schedule"><img src="../img/done.png">${title}</li>`;
                // console.log(dates[i].firstChild.classList.contains('this'))
                // console.log(1, title, calMth, det, _mth, _date)            
            } 
        }   else {
            // 달력이 현재 한달이 더 빠르고 , 일정이 저번 달의 것일 때
            if(det === _date && month.indexOf(calMth) === _mth){
                if(Number(_date)>20){
                    dates[i].innerHTML += `<ul><li class="schedule"><img src="../img/done.png">${title}</li>`;
                    // console.log(dates[i].firstChild.classList.contains('this'))
                    // console.log(2, title, calMth, det, _mth, _date)
                }
            }   else if(det === _date){
                // 달력이 현재 한달이 더 느리고, 일정이 다음 달의 것일 때
                if(Number(_date)<7){
                    dates[i].innerHTML += `<ul><li class="schedule"><img src="../img/done.png">${title}</li>`;
                    // console.log(dates[i].firstChild.classList.contains('this'))
                    // console.log(3, title, calMth, det, _mth, _date)
                } 
            }
        }        
    }
}));
        // if(dates[i].innerText===_date){
        //     dates[i].innerHTML += `<ul><li class="schedule"><img src="../img/done.png">${title}</li>`;
        // }

// for(let i=0; i<schedules.length; i++){
//     console.log(i);
//     const schedule = schedules[i];
//     const date = schedule['date'];
//     const title = schedule['title'];
//     const description = schedule['description'];
//     let _date = String(schedule['date']);
//     _date = _date.split(' ').slice(1,4);
    
//     const _day = _date[1];
//     const day = String(parseInt(_day));
//     const dates = document.querySelectorAll('.date');
    
//     if(dates.innerText===day){
//         dates.innerHTML += `<ul><li class="schedule"><img src="../img/done.png">${title}</li>`
//         continue;
//     }
// }


    // const handleDateClick = (event) => {
    //     console.log(event.target.innerHTML);
    //     event.target.innerHTML+=`<ul><li class='schedule'><img src="../img/done.png">JAVASCRIPT 코딩하기</li><li class='schedule'>JAVASCRIPT 코딩하기</li></ul>`
    //     console.log(event.target.innerHTML);
    // }
    // date.forEach(e => e.addEventListener('click', handleDateClick));
    
    // const handleDeleteClick = () => {
    //     const schedules = document.querySelectorAll('.schedule');
    
    // }

    // 현재 구조는 uri에 연도와 월이 명시되면 그에 따라서 html이 변경되고, 다시 html에서 연월을 받아와서 그에 따른 데이터를 가져오는 구조! 