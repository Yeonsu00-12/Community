window.onload = function() {
    const loginButton = document.querySelector('.button');
    const emailInput = document.getElementById('input_email');
    const pwInput = document.getElementById('input_password');
    const emailError = document.getElementById('email-error');
    const pwError = document.getElementById('pw-error');
    const signInBtn = document.querySelector('.signin-btn');

    const emailCheck = (email) => {
        let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return regex.test(email);
    }

    const strongPassword = (pw) => {
        let strongPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
        return strongPw.test(pw);
    }

    function updateButton() {
        loginButton.disabled = !(emailCheck(emailInput.value) && strongPassword(pwInput.value));
        loginButton.style.background = loginButton.disabled ? '#ACA0EB' : '#7F6AEE';
    }

    emailInput.addEventListener('input', (e) => {
        const inputValue = e.target.value;
        if(inputValue === ""){
            emailError.textContent = "이메일을 입력해주세요.";
        }else if(!emailCheck(inputValue)) {
            emailError.textContent = "올바른 이메일 주소 형식을 입력해주세요."
        } else {
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

    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "../signin/signin.html";
    });

    document.querySelector('.h1').addEventListener('click', () => {
        window.location.href = "../community/main.html"
    });

    document.getElementById('form_login').addEventListener('submit',(e)=> {
        e.preventDefault();
        fetch('user.json')
        .then((res)=> {
            if(!res.ok){
                throw new Error('Network res was not ok');
            }
            return res.json();
        })
        .then((data)=> {
            const email = emailInput.value;
            const password = pwInput.value;
            const matchingUser = data.users.find(user => user.email === email);
            console.log(data);
            if(matchingUser && matchingUser.password === password){
                console.log(data);
                updateButton();
                console.log(matchingUser);
                localStorage.setItem('userInfo', JSON.stringify(matchingUser));
                window.location.href = "../community/main.html";
            } else if(matchingUser) {
                alert("비밀번호가 다릅니다!");
            }
            else {
                alert("로그인 실패 : 잘못된 이메일 또는 비밀번호입니다.");
            }
        })
        .catch((error) => {
            console.error("error : ", error);
        })
    });
}