const btnSetTitle = document.querySelector('button');
const title = document.querySelector('#title');
btnSetTitle.addEventListener('click', () => {
    const theTitle = title.value;
    window.eAPI.setTitle(theTitle);
});