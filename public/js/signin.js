const signinBtn = document.querySelector(".button");
const emailInput = document.getElementById("input_email");
const pwInput = document.getElementById("input_pw");
const confirmPw = document.getElementById("confirm_pw");
const inputNickname = document.getElementById("input_nickname");
const porfileError = document.getElementById("profile-error");
const emailError = document.getElementById("email-error");
const pwError = document.getElementById("pw-error");
const confirmPwError = document.getElementById("confirmPw-error");
const nicknameError = document.getElementById("nickName-error");
const fileInput =  document.getElementById('chooseFile');

const emailCheck = (email) => {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    return regex.test(email);
}


const strongPassword = (pw) => {
    let strongPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    return strongPw.test(pw);
}

const nicknameCheck = (name) => {
    let pattern = /\s/g;
    return pattern.test(name);
}

function updateButton() {
    signinBtn.disabled = !(emailCheck(emailInput.value) && strongPassword(pwInput.value));
    signinBtn.style.background = signinBtn.disabled ? '#ACA0EB' : '#7F6AEE';
}

emailInput.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    if(inputValue === ""){
        emailError.textContent = "이메일을 입력해주세요.";
    }else if(!emailCheck(inputValue)) {
        emailError.textContent = "올바른 이메일 주소 형식을 입력해주세요."
    }
    else if (inputValue) {
        fetch(`http://localhost:4000/user/emailCheck?email=${inputValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.exist === true) {
                    emailError.textContent = "이미 사용중인 이메일입니다.";
                } else {
                    emailError.textContent = "사용 가능한 이메일입니다.";
                }
            })
            .catch(error => console.error('Error checking email:', error));
    }
    else {
        emailError.textContent = "";
    }
    updateButton();
});

pwInput.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    if(inputValue === ""){
        pwError.textContent = "비밀번호를 입력해주세요";
    } else if(!strongPassword(inputValue)) {
        pwError.textContent = "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    } else {
        pwError.textContent = "";
    }
    updateButton();
})

confirmPw.addEventListener('input', (e) => {
    const confirmValue = e.target.value;
    if(confirmValue !== pwInput.value) {
        confirmPwError.textContent = "비밀번호가 다릅니다!";
    } else {
        confirmPwError.textContent = "";
    }
    updateButton();
})

inputNickname.addEventListener('input', (e) => {
    const inputValue = e.target.value;
    if(inputValue === ""){
        nicknameError.textContent = "닉네임을 입력해주세요";
    } else if(nicknameCheck(inputValue)) {
        nicknameError.textContent = "띄어쓰기를 없애주세요";
    } else if (inputValue.length > 10){
        nicknameError.textContent = "닉네임을 최대 10자까지 작성 가능합니다.";
    } else if (inputValue){
        fetch(`http://localhost:4000/user/nicknameCheck?nickname=${inputValue}`)
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if(data.exist === true) {
                nicknameError.textContent = "이미 사용중인 닉네임입니다.";
            }else {
                nicknameError.textContent = "사용 가능한 닉네임입니다.";
            }
        })
        .catch(error => console.log("error checking nickname : ", error));
    } else {
        nicknameError.textContent = "";
    }
    updateButton();
});

function loadFile(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const imageElement = document.querySelector('.image');

        if (imageElement.src.startsWith('blob:')) {
            URL.revokeObjectURL(imageElement.src);
        }

        imageElement.src = URL.createObjectURL(file);
        imageElement.style.width = "149px";
        imageElement.style.height = "149px";
        imageElement.style.display = "block";
        imageElement.style.borderRadius = "100px";
    }
}

document.getElementById('chooseFile').addEventListener('change',loadFile);

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "/"
})

const form = document.getElementById('form_signin');
const fileInputValue = document.getElementById('chooseFile');
const profileError = document.getElementById('profile-error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = pwInput.value;
    const nickname = inputNickname.value;
    const filename = fileInputValue.files[0];

    const formData = new FormData();
    formData.append('email' , email);
    formData.append('password' , password);
    formData.append('nickname' , nickname);
    formData.append('profile' , filename);
    
    try {
        const response = await fetch('http://localhost:4000/user/signup', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Network response was not ok');
        }
        if (!fileInput.files.length) {
            profileError.textContent = '프로필 사진을 업로드해주세요!';
            return;
        }
        alert('회원가입에 성공하였습니다.');
            window.location.href = '/login';
    } catch (error) {
        console.error('Registration failed:', error);
    }
});

