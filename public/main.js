document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "../community/main.html"
});

document.querySelector('.header_img').addEventListener('click', () => {
    window.location.href = "../user/profile.html";
})

document.addEventListener('DOMContentLoaded', () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(userInfo && userInfo.profile) {
            document.querySelector('.header_img').src = userInfo.profile;
        }
})

fetch('/community.json')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            const container = document.querySelector('.container');
            container.innerHTML = '';

            data.data.forEach(item => {
                const titleCheck = item.title.length > 26 ? item.title.substring(0,23) + '...' : item.title;
                // 요소 생성 createElement
                const article = document.createElement('article');
                article.className = 'dummy';
                article.innerHTML = `
                    <h1 class="subtitle">${titleCheck}</h1>
                    <div class="info">
                    <p class="description">좋아요 ${item.likely} 댓글 ${item.comment} 조회 수 ${item.check}</p>
                    <p class="description">${item.date}</p>
                    </div>
                    <hr class="hr2"/>
                    <div class="user">
                    <img class="subtitle_img" src="${item.author.profile}" alt="profile"/>
                    <p class="user_name">${item.author.nickname}</p>
                    </div>
                `;
                article.onclick = () => {
                    window.location.href = `./detailedInquiry.html?id=${item.id}`;
                };
                //선택한 요소 안에 자식요소 추가
                container.appendChild(article);
            });
        })
        .catch((error) => {
            console.log(error);
        })