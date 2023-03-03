const btnOpenFile = document.querySelector('#openFile');
const filePath = document.querySelector('#filePath');
btnOpenFile.addEventListener('click', async () => {
    filePath.innerText = await window.eAPI.openFile();
})