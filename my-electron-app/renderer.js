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

    switch (e.target.id) {
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups(e);
            break;
        case 'delete-nosubmission-assignments':
            noSubmissionAssignments();
            break;

        default:
            break;
    }
}

// create html for empty Assignment group query
function emptyAssignmentGroups() {
    let emptyGroups = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = '';

    const eForm = document.createElement('form');

    eForm.innerHTML = `
        <div class="row align-items-center">
            <div class="col-auto">
                <label class="form-label">Course</label>
            </div>
            <div class="w-100"></div>
            <div class="col-2">
                <input id="course-id" type="text" class="form-control" aria-describedby="courseChecker" />
            </div>
            <div class="col-auto" >
                <span id="courseChecker" class="form-text" style="display: none;">Must only contain numbers</span>
            </div>
            <div class="w-100"></div>
            <div class="col-auto">
                <button id="check-btn" class="btn btn-primary mt-3">Check</button>
            </div>
        </div>
        <div id="response-container" class="mt-5">
        </div>
    `;

    eContent.append(eForm);

    // const eResponse = document.createElement('div');
    // eResponse.id = "response-container";
    // eResponse.classList.add('mt-5');
    // eContent.append(eResponse);

    const checkBtn = eForm.querySelector('#check-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        console.log('Inside renderer check');

        const domain = document.querySelector('#domain');
        const apiToken = document.querySelector('#token');
        const courseID = document.querySelector('#course-id').value;

        if (parseInt(courseID)) {
            document.querySelector('#courseChecker').style.display = 'none';
            const requestData = {
                domain: domain.value,
                token: apiToken.value,
                course: courseID
            }
            emptyGroups = await window.axios.getEmptyAssignmentGroups(requestData);
            console.log('found emtpy groups', emptyGroups.length);

            //const eContent = document.querySelector('#endpoint-content');
            const responseContainer = eContent.querySelector('#response-container');
            responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${emptyGroups.length} empty assignments.</span>
                        </div>

                        <div class="w-100"></div>

                        <div class="col-2">
                            <button id="remove-btn" type="button" class="btn btn-danger">Remove</button>
                        </div>
                        <div class="col-2">
                            <button id="cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>    
            `;

            const cancelBtn = document.querySelector('#cancel-btn');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                responseContainer.innerHTML = '';
                //clearData(courseID, responseContent);
            });

            const removeBtn = document.querySelector('#remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside remove');
                const responseDetails = responseContainer.querySelector('#response-details');
                responseDetails.innerHTML = `Removing ${emptyGroups.length} assignment groups...`;

                const messageData = {
                    domain: domain.value,
                    token: apiToken.value,
                    course: courseID,
                    groups: emptyGroups
                }

                const result = await window.axios.deleteEmptyAssignmentGroups(messageData);
                if (result) {
                    responseDetails.innerHTML = `Successfully removed ${emptyGroups.length} assignment groups.`
                } else {
                    responseDetails.innerHTML = 'Failed to remove assignment groups';
                }

            });
        } else {
            document.querySelector('#courseChecker').style.display = 'inline';
        }

    })
}

function userTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `${e.target.id} was clicked`;
}

async function conversationTemplate(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = '';

    switch (e.target.id) {
        case 'delete-conversations-subject':
            deleteConvos(e);
            break;
        case 'gc-between-users':
            getConvos(e);
            break;
        default:
            break;
    }



};

async function deleteConvos(e) {
    const domain = document.querySelector('#domain');
    const apiToken = document.querySelector('#token');
    const eHeader = document.createElement('div');
    eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    eContent.append(eHeader);

    const eForm = document.createElement('form');
    eForm.innerHTML = `
            <div class="row">
                <div class="col-auto">
                    <label for="user-id" class="form-label">Canvas user ID who sent the message </label>
                </div>
                <div class="w-100"></div>
                <div class="col-2">
                    <input type="text" id="user-id" class="form-control">
                </div>
            </div>
        <div class="row mt-3">
            <div class="col-auto">
                <label for="conversation-subject" class="form-label">Subject</label>
            </div>
            <div class="w-100"></div>
            <div class="col-6">
                <input id="conversation-subject" type="text" class="form-control">
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="convo-search">Search</button>`

    eContent.append(eForm);

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);

    // 1. Get messages
    // 2. Filter messages
    // 3. Delete messaages ( or cancel )
    // 4. If filter more go back to 2

    const searchBtn = document.querySelector('#convo-search');

    // ************************************
    // starting step 1. Getting messages
    //
    // ************************************

    searchBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        searchBtn.disabled = true;

        const responseContainer = document.querySelector('#response-container');
        responseContainer.innerHTML = 'Loading...';

        const convoSubject = document.querySelector('#conversation-subject');
        const userID = document.querySelector('#user-id');

        console.log(`Subject: ${convoSubject.value}, User_ID: ${userID.value}`);

        const searchData = {
            domain: domain.value,
            token: apiToken.value,
            subject: convoSubject.value.trim(),
            user_id: userID.value.trim()
        };

        console.log(searchData);
        const messages = await getMessages(searchData);
        console.log('Inside renderer total messages ', messages.length);

        // ********************************
        // Step 2. Filtering messages
        //
        // ********************************

        const filteredMessages = filterMessages(messages, convoSubject.value);
        const flattenedMessages = flattenMessages(filteredMessages);

        responseContainer.innerHTML = `
            <div id="response-info" class="container">Total messages searched: ${messages.length}. Found ${filteredMessages.length}.
                <div class="row justify-content-start my-2">
                    <div id="response-details" class="col-auto">
                    </div>
                </div>
                <div class="row justify-content-start my-2">
                    <div class="col-2">
                        <button id="remove-btn" type="button" class="btn btn-danger">Remove</button>
                    </div>
                    <div class="col-2">
                        <button id="cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                    </div>
                    <div class="col-3">
                        <button id="csv-btn" type="button" class="btn btn-secondary">Send to CSV</button>
                    </div>
                </div>
            </div>`


        const removeBtn = document.querySelector('#remove-btn');
        const cancelBtn = document.querySelector('#cancel-btn');
        const sendToCSV = document.querySelector('#csv-btn');

        removeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('inside remove');
            const responseDetails = responseContainer.querySelector('#response-details');
            responseDetails.innerHTML = `Removing ${filteredMessages.length} conversations...`;

            const messageData = {
                domain: domain.value,
                token: apiToken.value,
                user_id: userID.value.trim(),
                messages: flattenedMessages
            }
            const result = await window.axios.deleteConvos(messageData);
            if (result) {
                responseDetails.innerHTML = `Successfully removed ${filteredMessages.length}`
            } else {
                responseDetails.innerHTML = 'Failed to remove conversations';
            }

        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            clearData(userID, convoSubject, responseContainer, searchBtn);

        });

        sendToCSV.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('inside sendTocCSV');
            //console.log(filteredMessages);

            window.csv.sendToCSV(flattenedMessages);
        })

    });

    // *********************************************
    // starting step 3. Delete Messages (or cancel)
    //
    // *********************************************

    const deletedMessages = await deleteMessages(filterMessages);
}

// creates a new conversation object simplified to basic data
// to write to a csv before deletion
function flattenMessages(conversations) {
    const flattened = [];
    for (const conversation of conversations) {
        flattened.push({
            id: conversation.id,
            subject: conversation.subject,
            workflow_state: conversation.workflow_state,
            last_message: conversation.last_message,
            last_message_at: conversation.last_message_at,
            message_count: conversation.message_count
        });
    }
    return flattened;
}

async function getConvos(e) {
    const domain = document.querySelector('#domain');
    const apiToken = document.querySelector('#token');

    const eHeader = document.createElement('div');
    eHeader.classList.add('row');
    eHeader.innerHTML = `
        <div class="col border-bottom">
            <h3>Get Conversations Between Two Users</h3>
        </div>
    </div>`

    const eContent = document.querySelector('#endpoint-content');
    eContent.append(eHeader);

    const eForm = document.createElement('form');
    eForm.classList.add('row', 'mt-3');
    eForm.innerHTML = `
        <div class="col-2">
            <label for="user-1" class="form-label">First user</label>
        </div>
        <div class="col-2">
            <input type="text" id="user-1" class="form-control" aria-describedby="user-1-help">
        </div>
        <div class="col-8">
            <span id="user-1-help" class="form-text">Enter Canvas user_ID</span>
        </div>
        <div class="row mt-3">
            <div class="col-2">
                <label for="user-2" class="form-label">Second user</label>
            </div>
            <div class="col-2">
                <input type="text" id="user-2" class="form-control" aria-describedby="user-2-help">
            </div>
            <div class="col-8">
                <span id="user-2-help" class="form-text">Enter Canvas user_ID</span>
            </div>
        </div>
        <div class="col-12 mt-3">
            <div class="form-check form-switch">
                <label for="include-deletes" class="form-check-label">Include Deleted Messages</label>
                <input class="form-check-input" type="checkbox" value="" id="include-deletes">
            </div>
        </div>
        <div class="col-10 mt-3">
            <button type="submit" class="btn btn-primary">Search</button>
        </div>
    `
    eContent.append(eForm);

}

function clearData(userID, convoSubject, responseContainer, searchBtn) {
    userID.value = '';
    convoSubject.value = '';
    responseContainer.innerHTML = '';
    searchBtn.disabled = false;

}

function getMessages(searchData) {
    // const qResults = window.axios.getConvos(JSON.stringify(searchData));
    // console.log(qResults.length);
    const qResults = window.axios.getConvos(searchData);

    return qResults;
}

function filterMessages(messages, myFilter) {
    console.log('filtering converations by ', myFilter);
    let counter = 1;
    filteredConversations = messages.filter((conversation) => {
        if (counter % 100 === 0)
            console.log('Done with ', counter);
        // console.log('looking at: ', conversation.id, conversation.subject);
        if (conversation.subject === myFilter) {
            console.log('conversation found', conversation.id)
            return conversation;
        }
        counter++;
    });

    return filteredConversations;
}

function deleteMessages(fMessages) {
    //     const dResults = window.

    //     return dResults;
}
