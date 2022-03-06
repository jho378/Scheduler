const toggleBtn = document.querySelector('.navbar_toggleBtn');
const menu = document.querySelector('.navbar_menu');
const icons = document.querySelector('.navbar_icons');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
});

const createBtn = document.querySelector(
    '.bucketlist .bucketlist_header .bucketlist_create .create_btn'
);
const create = () => {
    alert('creating process 100%');
};
const createElem = () => {
    const wishlist = `<div id = 1>1. html</div>`;
    document.querySelector('.wishlist').innerHTML = wishlist;
};
// createBtn.addEventListener('click', () => create());

// createBtn.addEventListener('click', () => createElem());
const formatBtn = document.querySelectorAll('.bucketlist_view button');
const changeFormat = (event) => {
    const grid = document.querySelector('.bucketlist_view button.grid');
    const text = document.querySelector('.bucketlist_view button.text');
    const theme = document.querySelector('.bucketlist_view button.theme');
    const changeActive = event.target;
    if(changeActive===grid){
        changeActive.classList.add('active')
        text.classList.remove('active');
        theme.classList.remove('active');
    }
    else if(changeActive===text){
        changeActive.classList.add('active')
        grid.classList.remove('active');
        theme.classList.remove('active');
    }
    else if(changeActive===theme){
        changeActive.classList.add('active')
        text.classList.remove('active');
        grid.classList.remove('active');
    }
    // changeActive.classList.add('active');
    // changeActive.classList.add('')
    // console.log(event.target.classList);
}
formatBtn.forEach(btn => btn.addEventListener('click', changeFormat));


const wishlists = document.querySelector('.wishlists');
const wishlist = new Array(100);
for(let i=0; i<100; i++){
    wishlist.push(
    `<div class="wishlist">
    <h3 class="detail">Click to Add bucketlist</h3>
    <div class="img"></div>
    </div>`
    )
}
wishlists.innerHTML += wishlist.join('');