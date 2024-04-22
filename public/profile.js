const nickNameCheck = (name) => {
    let pattern = /^[^\s]{1,10}$/;
    return pattern.test(name);
}

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "../community/main.html"
});

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo && userInfo.profile) {
    document.querySelector('.header_img').src = userInfo.profile;
    document.querySelector('.profile-image').src = userInfo.profile;
}
if(userInfo && userInfo.email) {
    const container = document.querySelector('.wrap');
    container.innerHTML = `
        <h1 style="display: flex; align-items: center; justify-content: center;">회원정보 수정</h1>
        <p style="font-weight: 700; font-size: 15px;">프로필 사진*</p>
            <div class="profile-picture-container">
                <img src=${userInfo.profile} alt="profile" class="profile-image"/>
                <div class="profile-overlay">
                    <button type="button" class="change-button">변경</button>
                    <input type="file" class="profile-edit" accept="image/*" onchange="loadFile(event)">
                </div>
            </div>
            <div class="input">
                <p class="p_list1">이메일</p>
                <p class="userEmail">${userInfo.email}</p>
                <p class="p_list2">닉네임</p>
                <input type="text" placeholder="변경하실 닉네임 입력하세요." class="input--item"/>
                <div id="nickName-error" class="error-message"></div>
            </div>
            <div id="toast-container"></div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <button id="nickname-edit-btn" type="submit" class="button">수정하기</button>
                <button type="submit" class="quit-btn">회원 탈퇴</button>
            </div>    
            <div style="display: flex; justify-content: center; align-items: center;">
                <button type="submit" class="edit-btn">수정완료</button>
            </div>
        </div>
        <div id="modalOverlay" class="dimmed-background"></div>
        <div class="modal hidden">
            <div class="modal_popup">
                <h3>회원탈퇴 하시겠습니까?</h3>
                <p>작성된 게시글과 댓글은 삭제됩니다.</p>
                <div>
                    <button class="cancel_btn" type="button">취소</button>
                    <button class="submit_btn" type="button"  onclick="location.href='../login/login.html'">확인</button>
                </div>
            </div>
        </div>
    `
}

document.getElementById('nickname-edit-btn').addEventListener('click', () => {
    const nickNameInput = document.querySelector('.input--item').value;
    fetch('/user.json')
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
    })
    .then((data) => {
        const matchingNickname = data.users.find(user => user.nickname === nickNameInput);
        if(!nickNameInput) {
            document.getElementById('nickName-error').textContent = "*닉네임을 입력해주세요";
            return;
        }
        if(!nickNameCheck(nickNameInput)) {
            document.getElementById('nickName-error').textContent = "*닉네임은 최대 10자까지 작성 가능하며, 공백을 포함할 수 없습니다.";
            return;
        }
        if(matchingNickname) {
            document.getElementById('nickName-error').textContent = "중복된 닉네임입니다.";
            return;
        }
        showToast('수정완료!', 3000);
    }).catch((error) => {
        console.log("error", error);
    })
})

const openBtn = document.querySelector('.quit-btn');
const closeBtn = document.querySelector('.cancel_btn');
const modal = document.querySelector('.modal')

openBtn.addEventListener('click', showModal);
closeBtn.addEventListener('click', closeModal);

function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('visible');
    document.getElementById('modalOverlay').style.display = 'block';
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('visible');
    document.getElementById('modalOverlay').style.display = 'none';
    modal.style.display = 'none';
}

function showToast(message, duration = 3000){
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.textContent = message;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.display = 'block';
        requestAnimationFrame(() => {
            toast.style.opacity = 1;
            toast.style.marginBottom = '15px';
        });
    });

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.marginBottom = '0px';

        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, {once:true});
    },duration);
}

const profileImage = document.querySelector('.header_img');
const dropdownMenu = document.getElementById('profile-dropdown');

profileImage.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
});

window.addEventListener('click', (e) => {
    if(!e.target.matches('.header_img')) {
        if(!dropdownMenu.style.display === 'block'){
            dropdownMenu.style.display = 'none';
        }
    }
})