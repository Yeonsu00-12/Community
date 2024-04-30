export const getUserInfo = () => {
    return fetch('http://localhost:4000/user', {
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            updateLoginState(false);
            throw new Error('Not authenticated');
        }
        return res.json();
    })
    .then(data => {
        if (data.user) {
            console.log('유저 가져오기 성공 \n user data:', data.user);
            updateLoginState(true, data.user);
        } else {
            updateLoginState(false);
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        updateLoginState(false);
    });
};

export const updateLoginState = (isLoggedin, user = null) => {
    const loginButton = document.querySelector('.loginBtn');
    const logoutButton = document.querySelector('.logoutBtn');
    const profileImage = document.querySelector('.header_img');

    if (isLoggedin && user) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        profileImage.style.display = 'block';
        profileImage.src = user.profile;
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        profileImage.style.display = 'none';
    }
};

export const requireAuth = async() => {
    const isLoggedIn = await getUserInfo();
    if(isLoggedIn) {
        console.log('로그인 된 사용자');
    }else {
        alert('로그인 후 이용해주세요!');
        window.location.href = '/login';
    }
}

export const logout = () => {
    fetch('http://localhost:4000/user/logout', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (data.status === 200) {
            alert('로그아웃 성공!');
            updateLoginState(false);
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('Logout failed:', error);
    });
};