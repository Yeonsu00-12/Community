const pwInput = document.getElementById("input_pw");
const confirmPw = document.getElementById("confirm_pw");
const pwError = document.getElementById("pw-error");
const confirmPwError = document.getElementById("confirmPw-error");
const editButton = document.querySelector('.button');

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "../community/main.html"
});

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo && userInfo.profile) {
    document.querySelector('.header_img').src = userInfo.profile;
}

const updateButton = () => {
    const isPwVaild = strongPassword(pwInput.value) && (pwInput.value === confirmPw.value);
    editButton.disabled = !isPwVaild;
    editButton.style.background = editButton.disabled ? '#ACA0EB' : '#7F6AEE';
}

const strongPassword = (pw) => {
    let strongPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    return strongPw.test(pw);
}

pwInput.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    if(inputValue === ""){
        pwError.textContent = "비밀번호를 입력해주세요";
    } else if(!strongPassword(inputValue)) {
        pwError.textContent = "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else {
        pwError.textContent = "";
    }
    confirmPwError.textContent = (confirmPw.value !== inputValue) ? "비밀번호가 다릅니다!" : "";
    updateButton();
})

confirmPw.addEventListener('input', (e) => {
    const confirmValue = e.target.value;
    if(confirmValue === ""){
        confirmPwError.textContent = "비밀번호를 한번 더 입력해주세요!";
    }
    confirmPwError.textContent = (confirmValue !== pwInput.value) ? "비밀번호가 다릅니다!" : "";
    updateButton();
})

function showToast(message, duration = 3000){
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.textContent = message;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.display = 'block';
        requestAnimationFrame(() => {
            toast.style.opacity = 1;
            toast.style.marginBottom = '15px';
        });
    });

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.marginBottom = '0px';

        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, {once:true});
    },duration);
}

editButton.addEventListener('click', () => {
    pwError.textContent = '';
    confirmPwError.textContent = '';

    if(pwInput.value && confirmPw.value && pwInput.value === confirmPw.value && strongPassword(pwInput.value)){
        showToast('수정완료!', 3000);

        setTimeout(() => {
            window.location.href = "/community/main.html";
        },3200);
    }else {
        // If validations fail, display appropriate error messages
        if(!pwInput.value) {
            pwError.textContent = "비밀번호를 입력해주세요";
        } else if(!strongPassword(pwInput.value)) {
            pwError.textContent = "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        }

        if(!confirmPw.value) {
            confirmPwError.textContent = "비밀번호를 한번 더 입력해주세요!";
        } else if(pwInput.value !== confirmPw.value) {
            confirmPwError.textContent = "비밀번호가 다릅니다!";
        }
    }
}) 