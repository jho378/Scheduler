const toggleBtn = document.querySelector('.navbar_toggleBtn');
const menu = document.querySelector('.navbar_menu');
const icons = document.querySelector('.navbar_icons');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
})

const createBtn = document.querySelector('.bucketlist .bucketlist_header .bucketlist_create .create_btn');
const create = () => {
    alert('creating process 100%')
}
const createElem = () => {
    const wishlist = `<div id = 1>1. html</div>`
    document.querySelector('.wishlist').innerHTML = wishlist
}
createBtn.addEventListener('click', () => create());

createBtn.addEventListener('click', () => createElem());