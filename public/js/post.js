const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo && userInfo.profile) {
    document.querySelector('.header_img').src = userInfo.profile;
}

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "/"
});

const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content')
const contentError = document.getElementById('content-error');
const submitButton = document.querySelector('.submit');

const updateButtonState = () => {
    const bothFieldsFilled = title.value.trim().length > 0 && contentInput.value.trim().length > 0;
    
    submitButton.disabled = !bothFieldsFilled;
    submitButton.style.background = bothFieldsFilled ? '#7F6AEE' : '#ACA0EB';
};

titleInput.addEventListener('input', (e) => {
    if (e.target.value.length > 26) {
        e.target.value = e.target.value.substr(0, 26);
    }
    updateButtonState();
});
contentInput.addEventListener('input', updateButtonState);


submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const content = contentInput.value;
    const image = document.getElementById('imageUpload').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
        formData.append('image', image);
    }

    if(title && content){
        fetch('http://localhost:4000/posts', {
            method : 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert("게시글이 작성되었습니다!");
            window.location.href = "/";
        })
        .catch(err => {
            alert("게시글 작성 실패 !");
            console.log("왜 작성은 되는데 안넘어가냐? 진짜 ;;; : ", err);
            console.log(data);
        });
    }else {
        contentError.textContent = "제목과 내용을 입력해주세요!";
    }
})