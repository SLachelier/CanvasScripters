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
    // const eContent = document.querySelector('#endpoint-content');
    // eContent.innerHTML = `${e.target.id} was clicked`;
}

function assignmentTemplate(e) {
    // const eContent = document.querySelector('#endpoint-content');
    // eContent.innerHTML = `${e.target.id} was clicked`;

    switch (e.target.id) {
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups(e);
            break;
        case 'delete-nosubmission-assignments':
            noSubmissionAssignments();
            break;
        case 'delete-nonmodule-assignments':
            nonModuleAssignments();
            break;
        default:
            break;
    }
}

// create html for empty Assignment group query
function emptyAssignmentGroups() {
    let emptyGroups = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Delete Empty Assignment Groups</h3>
        </div>
    `;

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

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain');
        const apiToken = document.querySelector('#token');
        const courseID = document.querySelector('#course-id');

        if (parseInt(courseID.value)) {
            responseContainer.innerHTML = '<span>Checking...</span>'
            document.querySelector('#courseChecker').style.display = 'none';
            const requestData = {
                domain: domain.value,
                token: apiToken.value,
                course: courseID.value
            }
            emptyGroups = await window.axios.getEmptyAssignmentGroups(requestData);
            if (!emptyGroups) {
                checkBtn.disabled = false;
                responseContainer.innerHTML = 'Search Failed. Check domain, token or course id.';
            } else {
                console.log('found emtpy groups', emptyGroups.length);

                //const eContent = document.querySelector('#endpoint-content');
                responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${emptyGroups.length} empty assignment groups.</span>
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
                    checkBtn.disabled = false;
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
            }

        } else {
            document.querySelector('#courseChecker').style.display = 'inline';
        }

    })
}

function noSubmissionAssignments() {
    console.log('renderer > noSubmissionAssignments');

    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Delete No Submission Assignments</h3>
        </div>
    `;

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
            <div class="col-auto form-check form-switch mt-3 ms-3">
                <input id="graded-submissions" class="form-check-input" type="checkbox" role="switch" />
                <label for="graded-submissions" class="form-check-label">Delete assignments without submissions but with grades</label>
                    <div id="graded-help" class="form-text">
                        (otherwise this will only delete assignments with no submissions <em>AND</em> no grades)
                    </div>
            </div>
            <div class="col-auto">

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
    const checkBtn = eForm.querySelector('#check-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        const gradedSubmissions = eForm.querySelector('#graded-submissions').checked;
        console.log(gradedSubmissions);

        checkBtn.disabled = true;
        console.log('renderer > noSubmissionAssignments > check');

        const responseContainer = eContent.querySelector('#response-container');

        const domain = document.querySelector('#domain');
        const apiToken = document.querySelector('#token');
        const courseID = document.querySelector('#course-id');

        if (parseInt(courseID.value)) {
            responseContainer.innerHTML = '<span>Checking...</span>'
            document.querySelector('#courseChecker').style.display = 'none';
            const requestData = {
                domain: domain.value.trim(),
                token: apiToken.value.trim(),
                course: courseID.value.trim(),
                graded: gradedSubmissions
            }

            assignments = await window.axios.getNoSubmissionAssignments(requestData);
            if (!assignments) {
                checkBtn.disabled = false;
                responseContainer.innerHTML = 'Search failed. Check domain, token or course id.';

            } else {
                console.log(`found ${assignments.length} assignments with no submissions`);

                //const eContent = document.querySelector('#endpoint-content');
                responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${assignments.length} assignments with no submissions.</span>
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
                    checkBtn.disabled = false;
                    //clearData(courseID, responseContent);
                });

                const removeBtn = document.querySelector('#remove-btn');
                removeBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('renderer > getNoSubmissionAssignments > removeBtn');
                    const responseDetails = responseContainer.querySelector('#response-details');
                    responseDetails.innerHTML = `Removing ${assignments.length} assignments...`;

                    const assignmentIDs = assignments.map((assignment) => {
                        return {
                            name: assignment.name,
                            id: assignment.id
                        };
                    });

                    const messageData = {
                        domain: domain.value,
                        token: apiToken.value,
                        course: courseID.value,
                        assignments: assignmentIDs
                    }

                    const result = await window.axios.deleteNoSubmissionAssignments(messageData);
                    if (result) {
                        responseDetails.innerHTML = `Successfully removed ${assignments.length} assignments without submissions.`
                    } else {
                        responseDetails.innerHTML = 'Failed to remove assignment groups';
                    }

                });
            }

        } else {
            checkBtn.disabled = false;
            document.querySelector('#courseChecker').style.display = 'inline';
        }
    });
}

function nonModuleAssignments() {
    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Delete All Assignments Not in a Module</h3>
        </div>
    `;

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

    const checkBtn = eForm.querySelector('#check-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const courseID = document.querySelector('#course-id').value.trim();

        if (parseInt(courseID)) {
            responseContainer.innerHTML = '<span>Checking...</span>'
            document.querySelector('#courseChecker').style.display = 'none';

            const requestData = {
                domain: domain,
                token: apiToken,
                course: courseID
            }

            assignments = await window.axios.getNonModuleAssignments(requestData);
            if (!assignments) {
                checkBtn.disabled = false;
                responseContainer.innerHTML = 'Search Failed. Check domain, token or course id.';
            } else {
                console.log('found assignments', assignments.length);
                checkBtn.disabled = false;

                //const eContent = document.querySelector('#endpoint-content');
                responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${assignments.length} assignments not in modules.</span>
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
                    checkBtn.disabled = false;
                    //clearData(courseID, responseContent);
                });

                const removeBtn = document.querySelector('#remove-btn');
                removeBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('inside remove');
                    const responseDetails = responseContainer.querySelector('#response-details');
                    responseDetails.innerHTML = `Removing ${assignments.length} assignments...`;

                    const messageData = {
                        url: `https://${domain}/api/v1/courses/${courseID}/assignments`,
                        token: apiToken,
                        content: assignments
                    }

                    const result = await window.axios.deleteTheThings(messageData);
                    if (result) {
                        responseDetails.innerHTML = `Successfully removed ${assignments.length} assignments.`

                    } else {
                        responseDetails.innerHTML = 'Failed to remove assignments';

                    }
                    checkBtn.disabled = false;
                });
            }

        } else {
            document.querySelector('#courseChecker').style.display = 'inline';
            checkBtn.disabled = false;
        }

    })
}

function userTemplate(e) {
    switch (e.target.id) {
        case 'page-view':
            getPageViews(e);
            break;
        default:
            break;
    }
}

async function getPageViews(e) {
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Get User Page Views</h3>
        </div>
        <hr />
        `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
        <div class="row align-items-center" >
            <div class="col-auto">
                <label for="user-id" class="form-label">Canvas user ID</label>
            </div>
            <div class="col-2">
                <input type="text" id="user-id" class="form-control" aria-describedby="userChecker">
            </div>
            <div class="col-auto" >
                <span id="userChecker" class="form-text" style="display: none;">Must only contain numbers</span>
            </div>
        </div >
        <div class="row mt-3 align-items-center">
            <div class="col-auto">
                <label for="start-date" class="form-label">Start</label>
            </div>
            <div class="col-auto">
                <input id="start-date" type="date" class="form-control">
            </div>
            <div class="col-auto">
                <label for="end-date" class="form-label">End</label>
            </div>
            <div class="col-auto">
                <input id="end-date" type="date" class="form-control">
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="search">Search</button>
        <div id="response-container" class="mt-5">
        </div>
        `;

    eContent.append(eForm);

    const searchBtn = eContent.querySelector('#search');
    searchBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();


        console.log('renderer.js > getPageViews > searchBtn');



        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const userID = parseInt(eContent.querySelector('#user-id').value.trim());
        const startDate = eContent.querySelector('#start-date').value;
        const endDate = eContent.querySelector('#end-date').value;

        if (userID) {
            const searchData = {
                domain: domain,
                token: apiToken,
                user: userID,
                start: startDate,
                end: endDate
            };

            searchBtn.disabled = true;
            const responseContainer = document.querySelector('#response-container');
            responseContainer.innerHTML = 'Loading...';
            // const pageViews = await window.axios.getPageViews(searchData);
            const result = await window.axios.getPageViews(searchData);
            if (!result) {
                searchBtn.disabled = false;
                responseContainer.innerHTML = 'Search failed. Check domain, token or user id.';
            } else if (result === 'empty') {
                searchBtn.disabled = false;
                responseContainer.innerHTML = 'No page views found for user.';
            } else if (result === 'cancelled') {
                searchBtn.disabled = false;
                responseContainer.innerHTML = 'Save cancelled.';
            } else {
                responseContainer.innerHTML = 'Page views saved to file.';
            }
        } else {
            eContent.querySelector('#userChecker').style.display = 'inline';
        }
    });
}

async function conversationTemplate(e) {
    // const eContent = document.querySelector('#endpoint-content');
    // eContent.innerHTML = '';

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
    // const eHeader = document.createElement('div');
    // eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Delete Specific Conversations</h3>
        </div>
    `;

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
                <div class="col-auto">
                    <span id="userChecker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
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



        const convoSubject = document.querySelector('#conversation-subject');
        const userID = parseInt(document.querySelector('#user-id').value.trim());

        console.log(`Subject: ${convoSubject.value}, User_ID: ${userID.value}`);

        if (userID) {
            const responseContainer = document.querySelector('#response-container');
            responseContainer.innerHTML = 'Loading...';

            const searchData = {
                domain: domain.value,
                token: apiToken.value,
                subject: convoSubject.value,
                user_id: userID
            };

            console.log(searchData);

            const messages = await getMessages(searchData);
            if (!messages) {
                //alert('Query failed, check domain, token or user id.');

                searchBtn.disabled = false;
                responseContainer.innerHTML = 'Search Failed. Check domain, token or user id.';
            } else {
                console.log('renderer.js ', messages.length);

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
                        user_id: userID.value,
                        messages: flattenedMessages
                    }
                    const result = await window.axios.deleteConvos(messageData);
                    if (result) {
                        responseDetails.innerHTML = `Successfully removed ${filteredMessages.length}`;
                        searchBtn.disabled = false;
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

            }
        } else {
            eContent.querySelector('#userChecker').style.display = 'inline';
            searchBtn.disabled = false;
        }
    });
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

    // const eHeader = document.createElement('div');
    // eHeader.classList.add('row');
    // eHeader.innerHTML = `
    //     <div class="col border-bottom">
    //         <h3>Get Conversations Between Two Users</h3>
    //     </div>
    // </div>`

    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Get Conversations Between Two Users</h3>
        </div>
    `;

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
