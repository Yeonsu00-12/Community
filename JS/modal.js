const openBtn = document.querySelector('.quit-btn');
const closeBtn = document.querySelector('.cancel_btn');
const modal = document.querySelector('.modal')

openBtn.addEventListener('click', showModal);
closeBtn.addEventListener('click', closeModal);

function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('visible');
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('visible');
}