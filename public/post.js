const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo && userInfo.profile) {
    document.querySelector('.header_img').src = userInfo.profile;
}

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "../community/main.html"
});

const title = document.getElementById('title');
const content = document.getElementById('content')
const contentError = document.getElementById('content-error');
const submitButton = document.querySelector('.submit');
const updateButtonState = () => {
    const bothFieldsFilled = title.value.trim().length > 0 && content.value.trim().length > 0;
    
    submitButton.disabled = !bothFieldsFilled;
    submitButton.style.background = bothFieldsFilled ? '#7F6AEE' : '#ACA0EB';
};

title.addEventListener('input', (e) => {
    if (e.target.value.length > 26) {
        e.target.value = e.target.value.substr(0, 26);
    }
    updateButtonState();
});
content.addEventListener('input', updateButtonState);


submitButton.addEventListener('click', () => {
    const titleValue = title.value.trim();
    const contentValue = content.value.trim();

    if (titleValue.length === 0 || contentValue.length === 0) {
        contentError.textContent = "제목과 내용을 입력해주세요!";
        return;
    }
    else {
        contentError.textContent = "";
        console.log("Title and content submitted: ", titleValue, contentValue);
        window.location.href = "/community/main.html";
    }
})