import { getUserInfo, logout, updateLoginState, requireAuth} from "./auth.js";

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "/"
});

document.querySelector('.header_img').addEventListener('click', () => {
    window.location.href = "/profile";
})

document.querySelector('.button').addEventListener('click', () => {
    requireAuth(() => {
        window.location.href = "/write";
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.loginBtn');
    const logoutButton = document.querySelector('.logoutBtn');

    loginButton.addEventListener('click', () => {
        window.location.href = "/login";
    });

    logoutButton.addEventListener('click', () => {
        logout();
        window.location.href = "/login";
    });
    getUserInfo();
});

fetch('http://localhost:4000/posts')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            const container = document.querySelector('.container');
            container.innerHTML = '';
            console.log('받은 게시물들 :', data);

            if(!data || data.length === 0) {
                container.innerHTML = '<p>No posts available</p>';
                return;
            }

            data.forEach(item => {
                const titleCheck = item.title.length > 26 ? item.title.substring(0,23) + '...' : item.title;
                const profileImageSrc = item.profileImage ? `http://localhost:4000/${item.profileImage}` : 'default-profile.png';
                
                // 요소 생성 createElement
                const article = document.createElement('article');
                article.className = 'dummy';
                article.innerHTML = `
                    <h1 class="subtitle">${titleCheck}</h1>
                    <div class="info">
                    <p class="description">좋아요 ${item.likes} 댓글 ${item.commentCount} 조회 수 ${item.views}</p>
                    <p class="description">${new Date(item.created_At).toLocaleString()}</p>
                    </div>
                    <hr class="hr2"/>
                    <div class="user">
                    <img class="subtitle_img" src="${profileImageSrc || 'default-profile.png'}" alt="profile"/>
                    <p class="user_name">${item.nickname}</p>
                    </div>
                `;
                article.onclick = () => {
                    window.location.href = `/detailedInquiry/${item.postId}`;
                };
                // 선택한 요소 안에 자식요소 추가
                container.appendChild(article);
            });
        })
        .catch((error) => {
            console.log(error);
        })