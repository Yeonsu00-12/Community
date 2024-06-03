export const getUserInfo = async () => {
    try {
        const res = await fetch('http://localhost:4000/user', { credentials: 'include' });
        if (!res.ok) {
            updateLoginState(false);
            throw new Error('Not authenticated');
        }
        const data = await res.json();
        if (data.user) {
            console.log('유저 가져오기 성공 \n user data:', data.user);
            updateLoginState(true, data.user);
            return data.user;
        } else {
            updateLoginState(false);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        updateLoginState(false);
        return null;
    }
};

export const updateLoginState = (isLoggedin, user = null) => {
    const loginButton = document.querySelector('.loginBtn');
    const logoutButton = document.querySelector('.logoutBtn');
    const profileImage = document.querySelector('.header_img');

    if (loginButton && logoutButton && profileImage) {
        if (isLoggedin && user) {
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
            profileImage.style.display = 'block';
            profileImage.src = `http://localhost:4000/${user.profile}`;
        } else {
            loginButton.style.display = 'block';
            logoutButton.style.display = 'none';
            profileImage.style.display = 'none';
        }
    } else if (profileImage) {
        // write.html 페이지의 경우 프로필 이미지만 처리합니다.
        if (isLoggedin && user) {
            profileImage.src = `http://localhost:4000/${user.profile}`;
            profileImage.style.display = 'block';
        } else {
            profileImage.style.display = 'none';
        }
    }
};

export const requireAuth = async (callback) => {
    const user = await getUserInfo();
    if (user) {
        console.log('로그인 된 사용자');
        if (callback) callback();
    } else {
        alert('로그인 후 이용해주세요!');
        window.location.href = '/login';
    }
};

export const logout = async () => {
    try {
        const res = await fetch('http://localhost:4000/user/logout', { credentials: 'include' });
        const data = await res.json();
        if (data.status === 200) {
            alert('로그아웃 성공!');
            updateLoginState(false);
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
