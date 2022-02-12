const id = document.querySelector('#id');
const idLabel = document.querySelector('label[for="id"]');

const password = document.querySelector('#password');
const passwordLabel = document.querySelector('label[for="password"]');
const loginBtn = document.querySelector('#signin-btn ');

const handleEmpty = (event) => {
    if(id.value===""){
        event.preventDefault();
        idLabel.classList.add('warning');
        const idWarning = document.createElement("div");
        idWarning.classList.add('warning');
        idWarning.innerText = "User ID required";
        document.querySelector(".int-area.id").appendChild(idWarning);
        setTimeout(()=> idLabel.classList.remove('warning'), 2300);
    
    }
    if(password.value===""){
        event.preventDefault();
        passwordLabel.classList.add('warning');
        const passwordWarning = document.createElement("div");
        passwordWarning.classList.add('warning');
        passwordWarning.innerText = "Password required";
        document.querySelector(".int-area.password").appendChild(passwordWarning);
        setTimeout(()=> passwordLabel.classList.remove('warning'), 2300);
    }
}
loginBtn.addEventListener('click', handleEmpty);


