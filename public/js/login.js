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
        window.location.href = "/signin";
    });

    document.querySelector('.h1').addEventListener('click', () => {
        window.location.href = "/"
    });

    document.getElementById('form_login').addEventListener('submit',async(e)=> {
        e.preventDefault();
        const email = emailInput.value;
        const password = pwInput.value;

        const formData = new FormData();
        formData.append('email',email);
        formData.append('password',password);
        try {
            const response = await fetch('http://localhost:4000/user/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}),
            });
            if(!response.ok){
                throw new Error('Network res was not ok');
            }
            if(response.status === 200){
                alert('로그인 성공!');
                console.log('로그인 성공(프론트)');
                window.location.href = "/";
            }else {
                alert("이메일과 비밀번호가 일치하지 않습니다");
            } 
        }catch(error) {
            console.error("error : ", error);
        }
    });
}