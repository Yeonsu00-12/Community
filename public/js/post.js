import { getUserInfo } from './auth.js';

document.addEventListener("DOMContentLoaded", async function() {
    const userInfo = await getUserInfo();
    console.log(userInfo);

    const headerImgElement = document.querySelector('.header_img');
    if (userInfo && userInfo.profile && headerImgElement) {
        headerImgElement.src = `http://localhost:4000/${userInfo.profile}`;
        headerImgElement.style.display = 'block';
    } else if (headerImgElement) {
        headerImgElement.style.display = 'none';
        console.error('Profile image not found');
    }

    document.querySelector('.h1').addEventListener('click', () => {
        window.location.href = "/";
    });

    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const contentError = document.getElementById('content-error');
    const submitButton = document.querySelector('.submit');

    const updateButtonState = () => {
        const bothFieldsFilled = titleInput.value.trim().length > 0 && contentInput.value.trim().length > 0;
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

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = titleInput.value;
        const content = contentInput.value;
        const image = document.getElementById('imageUpload').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('userId', userInfo.userId);
        if (image) {
            formData.append('image', image);
        }

        console.log('form data : ', {title, content, userId: userInfo.userId, image});

        if (title && content) {
            try {
                const response = await fetch('http://localhost:4000/posts', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                console.log(data);
                alert("게시글이 작성되었습니다!");
                window.location.href = "/";
            } catch (err) {
                alert("게시글 작성 실패 !");
                console.log("왜 작성은 되는데 안넘어가냐? 진짜 ;;; : ", err);
            }
        } else {
            contentError.textContent = "제목과 내용을 입력해주세요!";
        }
    });
});
