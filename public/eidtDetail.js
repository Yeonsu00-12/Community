const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id',10));
fetch('/communityDetail.json')
.then((res) => {
    if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.json();
})
.then((data) => {
    const detail = data.data.find(detail => detail.id === id);
});