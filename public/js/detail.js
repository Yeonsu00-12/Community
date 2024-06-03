import { getUserInfo } from "./auth.js";

function showModal(modal) {
    modal.style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

function closeModal(modal) {
    document.getElementById('modalOverlay').style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    })
}

function editPost(id) {
    window.location.href = `/edit/${id}`;
    console.log('Editing post...');
}

function resetCommentForm() {
    const submitButton = document.querySelector('.submit');
    document.getElementById('comment-textarea').value = ''; // Clear the textarea
    submitButton.textContent = '대화 등록'; // Reset button text
    submitButton.removeAttribute('data-editing-comment-id');
}

function addModalClostEvent() {
    document.querySelectorAll('.cancel_btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(document.querySelector('.modal.visible')));
    });
}

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', (e) => {
    if(e.target === document.getElementById('modalOverlay')){
        closeModal(document.querySelector('.modal.visible'));
    }
});

// 댓글 등록 버튼에 대한 이벤트 리스너
function setupCommentSubmit(detail, userInfo) {
    if (!detail) {
        console.error('detail object is not defined.');
        return;
    }

    const submitButton = document.querySelector('.submit');
    submitButton.addEventListener('click', function() {
        const editingCommentId = this.getAttribute('data-editing-comment-id');
        const commentText = document.getElementById('comment-textarea').value;
        if(editingCommentId) {
            updateComment(editingCommentId, commentText);
            console.log(editingCommentId, commentText);
        } else {
            addComment(detail.postId, userInfo.userId, commentText);
            console.log(detail.postId, userInfo.userId, commentText);
        }
    });
}

// 댓글 추가
async function addComment(postId, userId, comment) {
    try {
        const res = await fetch('http://localhost:4000/posts/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId, userId, comment })
        });
        if(res.ok) {
            window.location.reload();
        } else {
            throw new Error('Failed to add comment.');
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Failed to add comment.');
    }
}

// 댓글 수정
async function updateComment(commentId, commentText) {
    try {
        const res = await fetch('http://localhost:4000/posts/comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commentId, comment : commentText })
        });
        if(res.ok) {
            alert('댓글이 수정되었습니다!');
            resetCommentForm();
            window.location.reload();
        } else {
            throw new Error('Failed to update comment.');
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Failed to update comment.');
    }
}

// 게시글 삭제 요청을 보내는 함수
async function deletePost(postId) {
    try {
        const res = await fetch(`http://localhost:4000/posts/${postId}`, {
            method: 'DELETE'
        });
        if(res.ok) {
            window.location.href = '/';
        } else {
            throw new Error('failed to delete the post.');
        }
    } catch (error) {
        console.error('Error : ', error);
    }
}

// 댓글 삭제 요청을 보내는 함수
async function deleteComment(commentId) {
    try {
        const res = await fetch(`http://localhost:4000/posts/comment/${commentId}`, {
            method: 'DELETE'
        });
        if(res.ok) {
            document.querySelector(`#comment-${commentId}`).remove();
            window.location.reload();
        } else {
            throw new Error('Failed to delete comment.');
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Failed to delete comment.');
    }
}

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
    .then(data => {
        const detail = data.data;
        console.log(detail);
        if(detail){
            const constainer = document.querySelector('.wrap');
            const isAuthor = userInfo && userInfo.userId === detail.userId;
            const imageSrc = detail.image ? `http://localhost:4000/${detail.image}` : 'default-profile.png';

            constainer.innerHTML = `
            <article class="dummy">
                <h1 class="subtitle">${detail.title}</h1>
                <div class="info">
                    <div class="info_div">
                    <img class="subtitle_img" src="http://localhost:4000/${detail.authorProfile}" alt="${detail.authorNickname}'s profile">
                        <p class="user_name">${detail.authorNickname}</p>
                        <p class="description">${new Date(detail.created_At).toLocaleString()}</p>
                    </div>
                    <div>
                        ${isAuthor ?
                        `<div>
                            <button class="edit">수정</button>
                            <button id="post_cancel_btn" class="quit-btn" data-modal-target="#postModal">삭제</button>
                        </div>
                        `: ''}
                        <div id="modalOverlay" class="dimmed-background"></div>
                        <div id="postModal" class="modal hidden">
                            <div class="modal_popup">
                                <h3>게시글을 삭제하시겠습니까?</h3>
                                <p>삭제한 내용은 복구 할 수 없습니다.</p>
                                <div>
                                    <button class="cancel_btn" type="button">취소</button>
                                    <button id="confirm_btn" class="submit_btn" type="button"  onclick="location.href='/'">확인</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="hr2"/>
            </article>
            <article class="content">
                <div><img src="${imageSrc || 'default-profile.png'}" class="empty_div"></div>
                    <p class="text">${detail.content}</p>
            </article>
            <article class="article3">
                <div class="views"><p style="margin: 0;">${detail.views}</p><p style="margin: 0">조회수</p></div>
                <div class="comment"><p style="margin: 0;">${detail.commentCount}</p><p style="margin: 0">댓글</p></div>
            </article>
            <hr class="hr2"/>
            <article class="article4">
                <textarea id="comment-textarea"placeholder="댓글을 남겨주세요!"></textarea>
                <div style="display: flex; padding: 0.5rem; justify-content: flex-end; height: 30px; width: 590px; top: 1000px;">
                    <button class="submit" type="submit">대화 등록</button>
                </div>
                <hr style="width: 600px; top: 1040px; margin:0;"/>
            </article>
            <article class="article5">
                <div style="display: flex; flex-direction: column; width: 100%;">
                    ${detail.comments.map(comment =>{
                        const isCommentAuthor = userInfo && userInfo.nickname === comment.nickname;
                        return `
                        <div class="comment-container" data-comment-id="${comment.commentId}">
                            <div style="display: flex; flex-direction: row; align-items: center; margin-top: 1rem;">
                            <img class="subtitle_img" src="http://localhost:4000/${comment.userProfile}">
                                <p class="user_name">${comment.nickname}</p>
                                <p class="description">${new Date(comment.created_At).toLocaleString()}</p>
                            </div>
                            <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding-left:2.5rem">
                                <p id="commentText-${comment.commentId}">${comment.comment}</p>
                                <div style="display: flex">
                                ${isCommentAuthor ? 
                                    `<div>
                                        <button data-comment-id="${comment.commentId}" class="edit2">수정</button>
                                        <button id="comment-delete-btn" data-comment-id="${comment.commentId}" class="quit-btn">삭제</button>
                                    </div>
                                ` : ""}
                                    <div id="commentModal-${comment.commentId}" class="modal hidden">
                                        <div class="modal_popup">
                                            <h3>댓글을 삭제하시겠습니까?</h3>
                                            <p>삭제한 내용은 복구 할 수 없습니다.</p>
                                            <div>
                                                <button id="comment-cancel-btn"class="cancel_btn" type="button">취소</button>
                                                <button id="confirm_delete_btn" class="submit_btn" type="button">확인</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    `;}).join('')}
                </div>
            <article>
            `;

            document.querySelector('.wrap').addEventListener('click', function(e) {
                // postModal에 대한 삭제 버튼 클릭 이벤트
                if (e.target.matches('#post_cancel_btn')) {
                    const modal = document.getElementById('postModal');
                    showModal(modal);
                }
                // postModal 확인 버튼 클릭 이벤트
                if (e.target.matches('#confirm_btn')) {
                    deletePost(id);
                }
                // commentModal에 대한 삭제 버튼 클릭 이벤트
                if (e.target.matches('#comment-delete-btn')) {
                    const commentId = e.target.getAttribute('data-comment-id');
                    const modal = document.getElementById(`commentModal-${commentId}`);
                    showModal(modal);
                }
                // commentModal에 대한 삭제 버튼 클릭 시 모달 표시
                if (e.target.id.startsWith('confirm_delete_btn')) {
                    const commentId = e.target.getAttribute('data-comment-id');
                    deleteComment('comment', commentId);
                }
                if (e.target.matches('.cancel_btn')) {
                    const modals = document.querySelectorAll('.modal');
                    modals.forEach(modal => closeModal(modal));
                }
                // 수정 버튼 클릭 이벤트
                if (e.target.classList.contains('edit2')) {
                    const commentId = e.target.getAttribute('data-comment-id');
                    const commentText = document.querySelector(`#commentText-${commentId}`).textContent;
                    document.getElementById('comment-textarea').value = commentText;
                    document.querySelector('.submit').textContent = '댓글 수정';
                    document.querySelector('.submit').setAttribute('data-editing-comment-id', commentId);
                }
            });

            setupCommentSubmit(detail, userInfo);
            addModalClostEvent();
            document.querySelector('.edit').addEventListener('click', () => {
                editPost(detail.postId);
            });
        }else {
            console.log('상세정보를 찾을 수 없습니다.');
            console.log(id);
        }
    })
        .catch((error) => {
    console.error('Error:', error);
    });
});