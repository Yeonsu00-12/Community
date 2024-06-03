import { getUserInfo } from "./auth.js";

document.addEventListener("DOMContentLoaded", async function() {
    const userInfo = await getUserInfo();
    console.log(userInfo); // userInfo 로그 출력

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
    const id = window.location.pathname.split('/').pop();

    fetch(`http://localhost:4000/posts/${id}`)
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
    })
    .then((data) => {
        const detail = data.data;
        const title = document.querySelector('.input');
        const content = document.getElementById('content');
        const image = document.getElementById('imageUpload');
        if(detail) {
            // input인 경우 value로 불러와야함
            title.value = detail.title.substring(0,26);
            content.textContent = detail.content;
            if (detail.image) {
                const imgPreview = document.createElement('img');
                imgPreview.src = `http://localhost:4000/${detail.image}`;
                imgPreview.alt = "detail image";
                image.parentElement.appendChild(imgPreview);
            }

            document.querySelector('.submit').addEventListener('click', (e) => {
                e.preventDefault();

                const formData = new FormData();
                formData.append('title', title.value);
                formData.append('content', content.value);
                if (image.files[0]) {
                    formData.append('image', image.files[0]);
                }

                fetch(`http://localhost:4000/posts/${id}`, {
                    method : 'PUT',
                    body: formData
                })
                .then((res) => {
                    if(!res.ok){
                        throw new Error('Network res was not ok ' + res.statusText);
                    }
                    return res.json();
                })
                .then((data) => {
                    alert('게시글이 수정되었습니다.');
                    setTimeout(() => {
                        window.location.href = `/detailedInquiry/${id}`;
                    },1000);
                })
                .catch((err) => {
                    console.log(err);
                    alert('게시글 수정 실패!');
                });
            });
        } else {
            console.log('no id : ', id);
        }
    }).catch((error) => {
        console.log(error);
    })
});