const information = document.getElementById('info');
information.innerText = `This document is using Chrome v${versions.chrome()}, Node v${versions.node()}, electron v${versions.electron()}`;

const func = async () => {
    const response = await window.versions.ping();
    console.log(response);
}

func();