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

function editPost() {
    window.location.href = `/edit?id=${id}`;
    console.log('Editing post...');
}

function resetCommentForm() {
    const submitButton = document.querySelector('.submit');
    document.getElementById('comment-textarea').value = ''; // Clear the textarea
    submitButton.textContent = '대화 등록'; // Reset button text
    submitButton.removeAttribute('data-editing-comment-id'); // Remove editing ID
}

function deleteItem(itemType, itemid) {
    if(itemType === 'post'){
        document.querySelector('#post-${itemId}').style.display = 'none';
    } else if(itemType === 'comment'){
        document.querySelector('#comment-${itemId}').style.display = 'none';
    }
    closeModal();
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
function setupCommentSubmit() {
    const submitButton = document.querySelector('.submit');
    submitButton.addEventListener('click', function() {
        const editingCommentId = this.getAttribute('data-editing-comment-id');
        if(editingCommentId) {
            console.log('업데이트 된 ID:', editingCommentId);
            resetCommentForm();
            alert("댓글이 수정되었습니다.");
        } else {
            console.log('Submitting new comment');
            alert("댓글이 등록되었습니다.");
            document.getElementById('comment-textarea').value = '';
        } 
    });
}// 새 댓글 등록 로직 수행...

document.querySelector('.h1').addEventListener('click', () => {
    window.location.href = "/"
})

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo && userInfo.profile) {
    document.querySelector('.header_img').src = userInfo.profile;
}

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id',10));
fetch(`http://localhost:4000/posts/${item.id}`)
.then((res) => {
    if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.json();
})
.then(data => {
    const detail = data.data.find(detail => detail.id === id);
    if(detail){
        const constainer = document.querySelector('.wrap');
        const isAuthor = userInfo && userInfo.nickname === detail.auther.nickname;

        constainer.innerHTML = `
        <article class="dummy">
            <h1 class="subtitle">${detail.title}</h1>
            <div class="info">
                <div class="info_div">
                    <img class="subtitle_img" src="${detail.auther.profile}" alt="${detail.auther.nickname}'s profile">
                    <p class="user_name">${detail.auther.nickname}</p>
                    <p class="description">${detail.date}</p>
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
            <div><img src="${detail.image}" class="empty_div"></div>
                <p class="text">${detail.content}</p>
        </article>
        <article class="article3">
            <div class="views"><p style="margin: 0;">${detail.check}</p><p style="margin: 0">조회수</p></div>
            <div class="comment"><p style="margin: 0;">${detail.comment}</p><p style="margin: 0">댓글</p></div>
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
                    <div class="comment-container" data-comment-id="${comment.id}">
                        <div style="display: flex; flex-direction: row; align-items: center; margin-top: 1rem;">
                            <img class="subtitle_img" src="${comment.userImage}">
                            <p class="user_name">${comment.nickname}</p>
                            <p class="description">${comment.comment_date}</p>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding-left:2.5rem">
                            <p id="commentText-${comment.id}">${comment.comment}</p>
                            <div style="display: flex">
                            ${isCommentAuthor ? 
                                `<div>
                                    <button data-comment-id="${comment.id}" class="edit2">수정</button>
                                    <button id="comment-delete-btn" data-comment-id="${comment.id}" class="quit-btn">삭제</button>
                                </div>
                            ` : ""}
                                <div id="commentModal-${comment.id}" class="modal hidden">
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
            // commentModal에 대한 삭제 버튼 클릭 이벤트
            if (e.target.matches('#comment-delete-btn')) {
                const commentId = e.target.getAttribute('data-comment-id');
                console.log(commentId);
                const modal = document.getElementById(`commentModal-${commentId}`);
                showModal(modal);
            }
            // commentModal에 대한 삭제 버튼 클릭 시 모달 표시
            if (e.target.id.startsWith('confirm_delete_btn')) {
                // 댓글 삭제 로직 수행...
                closeModal(document.getElementById('commentModal'));
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

        setupCommentSubmit();
        addModalClostEvent();
        document.querySelector('.edit').addEventListener('click', editPost);
    }else {
        console.log('상세정보를 찾을 수 없습니다.');
        console.log(id);
    }
})
    .catch((error) => {
console.error('Error:', error);
});