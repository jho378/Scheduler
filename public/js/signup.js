const submitBtn = document.querySelector('#signup-btn');
const handleSubmit = (event) => {
    // event.preventDefault();
    console.log(event);
    console.log(req.body);
}
submitBtn.addEventListener('click', handleSubmit);