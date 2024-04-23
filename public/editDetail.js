const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'),10);
fetch('/communityDetail.json')
.then((res) => {
    if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.json();
})
.then((data) => {
    const detail = data.data.find(detail => detail.id === id);
    const title = document.querySelector('.input');
    const content = document.getElementById('content');
    const image = document.getElementById('imageUpload');
    if(detail) {
        // input인 경우 value로 불러와야함
        title.value = detail.title.substring(0,26);
        content.textContent = detail.content;
        if(detail.image && detail.image !== 'none'){
            image.src = detail.image;
            image.alt = "detail image";
        }

        document.querySelector('.submit').addEventListener('click', () => {
            alert('게시글이 수정되었습니다.');
            setTimeout(() => {
                window.location.href = `/community/detailedInquiry.html?id=${id}`;
            })
        })
    } else {
        console.log('no id : ', id);
    }
}).catch((error) => {
    console.log(error);
})