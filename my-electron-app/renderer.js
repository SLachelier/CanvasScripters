// (async () => {
//     const result = await window.axios.get();
//     console.log(result);
// })();

const endpointSelect = document.querySelector('#endpoints');
endpointSelect.addEventListener('click', (e) => {

    const parentEl = e.target.parentElement.id;

    console.log('clicked ', e.target);
    console.log('Parent element ', parentEl);
    console.dir(e.target);
    switch (parentEl) {
        case 'course-endpoints':
            courseTemplate(e);
            break;
        case 'assignment-endpoints':
            assignmentTemplate(e);
            break;
        case 'user-endpoints':
            userTemplate(e);
            break;
        case 'conversation-endpoints':
            conversationTemplate(e);
            break;

        default:
            break;
    }
});

function courseTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `${e.target.id} was clicked`;
}
function assignmentTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `${e.target.id} was clicked`;
}
function userTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `${e.target.id} was clicked`;
}
async function conversationTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = '';

    const domain = document.querySelector('#domain');
    const apiToken = document.querySelector('#token');
    const eHeader = document.createElement('div');
    eHeader.innerHTML = `<h3>${e.target.id}</h3> <h6>domain: ${domain.value} Token: ${apiToken.value}</h6></div>`
    eContent.append(eHeader);

    const eForm = document.createElement('form');
    eForm.innerHTML = `<div class="mb-3"><label for="user-id">Enter user id of who send the message: </label><input type="text" id="user-id" placeholder="user_id"></div><div class="mb-3"><label for="conversation-subject">Enter Subject: </label><input id="conversation-subject" type="text" placeholder="conversation subject"></div><button id="convo-search">Search</button>`

    eContent.append(eForm);

    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);

    const searchBtn = document.querySelector('#convo-search');
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        searchBtn.disabled = true;

        const responseContainer = document.querySelector('#response-container');
        responseContainer.innerHTML = 'Loading...';

        const convoSubject = document.querySelector('#conversation-subject').value;
        const userID = document.querySelector('#user-id').value;

        console.log(`Subject: ${convoSubject}, User_ID: ${userID}`);

        const searchData = {
            domain: domain.value,
            token: apiToken.value,
            subject: convoSubject,
            user_id: userID
        };


        const qResults = window.axios.get(JSON.stringify(searchData));
        console.log(qResults);
    });


}