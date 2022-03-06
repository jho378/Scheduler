// Date 띄우기
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();
const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
document.querySelector('.year_month').innerHTML = `<span>${months[currentMonth]} ${currentDay} ${currentYear}</span>`;