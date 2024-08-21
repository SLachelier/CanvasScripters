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
        case 'assignment-endpoints':
            assignmentTemplate(e);
            break;
        case 'assignment-group-endpoints':
            assignmentGroupTemplate(e);
            break;
        case 'user-endpoints':
            userTemplate(e);
            break;
        case 'conversation-endpoints':
            conversationTemplate(e);
            break;
        case 'commchannel-endpoints':
            commChannelTemplate(e);
            break;
        case 'course-endpoints':
            courseTemplate(e);
            break;
        default:
            break;
    }
});

function assignmentTemplate(e) {
    // const eContent = document.querySelector('#endpoint-content');
    // eContent.innerHTML = `${e.target.id} was clicked`;

    switch (e.target.id) {
        case 'create-assignments':
            assignmentCreator();
            break;
        case 'create-assignment-groups':
            assignmentGroupCreator();
            break;
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups();
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

// ****************************************************
// Create Assignments -- NOT COMPLETE
// ****************************************************
function assignmentCreator() {
    let emptyGroups = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Create Assignments</h3>
        </div>
    `;

    const eForm = document.createElement('form');

    eForm.innerHTML = `
        <div class="row">
            <div class="row align-items-center">
                <div class="col-2">
                    <label class="form-label">Course</label>
                    <input id="course-id" type="text" class="form-control" aria-describedby="courseChecker" />
                </div>
                <div class="col-auto" >
                    <span id="courseChecker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
                <div class="col-2">
                    <label class="form-label">How many</label>
                    <input id="assignment-number" type="text" class="form-control" value="1">
                </div>
                <div class="col-2">
                    <label class="form-label">Points</label>
                    <input id="assignment-points" type="text" class="form-control" value="10">
                </div>
            </div>
            <hr class="mt-2">
            <div class="row">
                <div>
                    <h5>Assignment Settings</h5>
                    <div class="col-auto form-check form-switch" >
                        <input id="assignment-publish" class="form-check-input" type="checkbox" role="switch" checked>
                        <label for="assignment-publish" class="form-check-label">Publish</label>
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <input id="assignment-peer" class="form-check-input" type="checkbox" role="switch">
                        <label for="assignment-peer" class="form-check-label">Peer Reviews</label>
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <input id="assignment-anonymous" class="form-check-input" type="checkbox" role="switch">
                        <label for="assignment-anonymous" class="form-check-label">Anonymous</label>
                    </div>
                    <div class="row justify-content-start align-items-baseline" >
                        <label for="assignment-grade-type" class="form-label col-auto">Display Grade as</label>
                        <select id="assignment-grade-type" class="form-select col-auto custom-select-width">
                            <option value="points" selected>Points</option>
                            <option value="percent">Percent</option>
                            <option value="letter">Letter</option>
                            <option value="gpa_scale">GPA Scale</option>
                            <option value="pass_fail">Complete/Incomplete</option>
                        </select>
                    </div>
                </div>
                <div id="submission-types">
                    <h5>Submission Types</h5>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-none" class="form-label">No Submission</label>
                        <input id="submission-none" class="form-check-input" type="checkbox" role="switch" />
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-on_paper" class="form-label">On Paper</label>
                        <input id="submission-on_paper" class="form-check-input" type="checkbox" role="switch" />
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-online_upload" class="form-label">File Upload</label>
                        <input id="submission-online_upload" class="form-check-input" type="checkbox" role="switch" checked/>
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-online_text_entry" class="form-label">Text Entry</label>
                        <input id="submission-online_text_entry" class="form-check-input" type="checkbox" role="switch" />
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-online_url" class="form-label">Website URL</label>
                        <input id="submission-online_url" class="form-check-input" type="checkbox" role="switch" />
                    </div>
                    <div class="col-auto form-check form-switch" >
                        <label for="submission-media_recording" class="form-label">Media recording</label>
                        <input id="submission-media_recording" class="form-check-input" type="checkbox" role="switch" />
                    </div>
                </div>
            </div>
            <div class="w-100"></div>
            <div class="col-auto">
                <button id="create-btn" class="btn btn-primary mt-3">Create</button>
            </div>
        </div>
        <div id="response-container" class="mt-5">
        </div>
    `;

    eContent.append(eForm);

    const submissionTypes = eForm.querySelector('#submission-types');

    function uncheckAllSubmissions() {
        submissionTypes.querySelector('#submission-none').checked = false;
        submissionTypes.querySelector('#submission-on_paper').checked = false;
        submissionTypes.querySelector('#submission-online_upload').checked = false;
        submissionTypes.querySelector('#submission-online_text_entry').checked = false;
        submissionTypes.querySelector('#submission-online_url').checked = false;
        submissionTypes.querySelector('#submission-media_recording').checked = false;
    }

    function handleSubmissionTypes(e) {
        if (e.target.id === 'submission-none' || e.target.id === 'submission-on_paper') {
            uncheckAllSubmissions();
            e.target.checked = true;
        } else {
            submissionTypes.querySelector('#submission-none').checked = false;
            submissionTypes.querySelector('#submission-on_paper').checked = false;
        }
    }
    submissionTypes.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        handleSubmissionTypes(e);
    });

    const createBtn = eForm.querySelector('#create-btn');
    createBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        createBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain');
        const apiToken = document.querySelector('#token');

        const checkedSubTypes = submissionTypes.querySelectorAll('input[type="checkbox"]:checked');
        const checkedSubmissionTypes = Array.from(checkedSubTypes).map((subType) => {
            return subType.id.split('-')[1];
        });
        console.log('checkedSubmissionTypes', checkedSubmissionTypes);


        const courseID = document.querySelector('#course-id');
        const assignmentNumber = document.querySelector('#assignment-number');
        const assignmentPoints = document.querySelector('#assignment-points');
        const publish = document.querySelector('#assignment-publish').checked;
        const peerReviews = document.querySelector('#assignment-peer').checked;
        const anonymous = document.querySelector('#assignment-anonymous').checked;
        const gradeType = document.querySelector('#assignment-grade-type').value;
        // const noSubmission = document.querySelector('#submission-none').checked;
        // const onPaper = document.querySelector('#submission-on_paper').checked;
        // const fileUpload = document.querySelector('#submission-upload').checked;
        // const textEntry = document.querySelector('#submission-text').checked;
        // const websiteURL = document.querySelector('#submission-url').checked;
        // const mediaRecording = document.querySelector('#submission-media').checked;

        const requestData = {
            domain: domain.value.trim(),
            token: apiToken.value.trim(),
            course: courseID.value.trim(),
            number: assignmentNumber.value.trim(),
            points: parseInt(assignmentPoints.value.trim()),
            publish: publish ? 'published' : 'unpublished',
            peer_reviews: peerReviews,
            anonymous: anonymous,
            grade_type: gradeType,
            submissionTypes: checkedSubmissionTypes
        }

        const assignments = await window.axios.createAssignments(requestData);
        console.log('assignments', assignments);
        if (assignments) {
            responseContainer.innerHTML = 'Assignments created.';

        } else {
            responseContainer.innerHTML = 'Failed to create assignments.';

        }
        createBtn.disabled = false;
    });
}


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
                checkBtn.disabled = false;
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
                        url: `https://${domain.value}/api/v1/courses/${courseID.value}/assignment_groups`,
                        token: apiToken.value,
                        content: emptyGroups
                    }

                    //const result = await window.axios.deleteTheThings(messageData);
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
            <h3>Delete Assignments With No Submissions</h3>
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
                <label for="graded-submissions" class="form-check-label">Delete assignments with grades</label>
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
                checkBtn.disabled = false;
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
                    if (result.status) {
                        responseDetails.innerHTML = `<p>Successfully removed ${assignments.length} assignments without submissions.</p>`
                    } else {
                        responseDetails.innerHTML = `<p>Failed to remove assignments<p><p>${result.message}`;
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

function assignmentGroupTemplate(e) {
    switch (e.target.id) {
        case 'create-assignment-groups':
            assignmentGroupCreator();
            break;
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups();
            break;
        default:
            break;
    }
}


// ****************************************************
// Create Assignment Groups -- NOT COMPLETE
// ****************************************************
function assignmentGroupCreator() {
    let emptyGroups = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Create Assignment Groups</h3>
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
        case 'download-conversations-csv':
            downloadConvos(e);
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
                searchBtn.disabled = false;

                console.log('renderer.js ', messages.length);

                // ********************************
                // Step 2. Filtering messages
                //
                // ********************************

                // const filteredMessages = filterMessages(messages, convoSubject.value);
                // const flattenedMessages = flattenMessages(filteredMessages);

                //     responseContainer.innerHTML = `
                // <div id="response-info" class="container">Total messages searched: ${messages.length}. Found ${filteredMessages.length}.
                //     <div class="row justify-content-start my-2">
                //         <div id="response-details" class="col-auto">
                //         </div>
                //     </div>
                //     <div class="row justify-content-start my-2">
                //         <div class="col-2">
                //             <button id="remove-btn" type="button" class="btn btn-danger">Remove</button>
                //         </div>
                //         <div class="col-2">
                //             <button id="cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                //         </div>
                //         <div class="col-3">
                //             <button id="csv-btn" type="button" class="btn btn-secondary">Send to CSV</button>
                //         </div>
                //     </div>
                // </div>`

                responseContainer.innerHTML = `
                    <div id="response-info" class="container">Found ${messages.length} messages.
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
                    </div>
            `;


                const removeBtn = document.querySelector('#remove-btn');
                const cancelBtn = document.querySelector('#cancel-btn');
                const sendToCSV = document.querySelector('#csv-btn');

                removeBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('inside remove');
                    const responseDetails = responseContainer.querySelector('#response-details');
                    responseDetails.innerHTML = `Removing ${messages.length} conversations...`;

                    // const messageIDs = messages.map((message) => {
                    //     return message.node.conversation;
                    // });

                    const messageData = {
                        domain: domain.value,
                        token: apiToken.value,
                        user_id: userID.value,
                        messages: messages
                    }
                    const result = await window.axios.deleteConvos(messageData);
                    if (result) {
                        responseDetails.innerHTML = `Successfully removed ${messages.length}`;
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

                    window.csv.sendToCSV(messages);
                })

            }
        } else {
            eContent.querySelector('#userChecker').style.display = 'inline';
            searchBtn.disabled = false;
        }
    });
}

async function downloadConvos(e) {
    const domain = document.querySelector('#domain');
    const apiToken = document.querySelector('#token');
    // const eHeader = document.createElement('div');
    // eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Download Converations to CSV</h3>
        </div>
    `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
            <div class="row">
                <div class="col-auto">
                    <label for="user-id" class="form-label">Canvas user ID</label>
                </div>
                <div class="col-2">
                    <input type="text" id="user-id" class="form-control" aria-desribedby="userChecker">
                </div>
                <div class="col-auto">
                    <span id="userChecker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-auto form-check form-switch mt-2 ms-3 mb-2">
                    <input id="delete-convos" class="form-check-input" type="checkbox" role="switch" />
                    <label for="deleted-convos" class="form-check-label">Only search for <em>Deleted</em> Conversations</label>
                        <div id="graded-help" class="form-text">
                            (otherwise this will search for active and deleted)
                        </div>
                </div>
                <div class="w-100"></div>
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
                <div class="w-100"></div>
                <div class="col-auto">
                    <button type="button" class="btn btn-primary mt-3" id="convo-search">Search</button>
                </div>
            </div>
        <div id="response-container" class="mt-5"></div>`

    eContent.append(eForm);


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

async function commChannelTemplate(e) {
    switch (e.target.id) {
        case 'check-commchannel':
            checkComm(e);
            break;
        case 'download-conversations-csv':
            downloadConvos(e);
            break;
        case 'gc-between-users':
            getConvos(e);
            break;
        default:
            break;
    }
}

function checkComm(e) {
    const domain = document.querySelector('#domain');
    const apiToken = document.querySelector('#token');
    // const eHeader = document.createElement('div');
    // eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Check email</h3>
        </div>
    `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
            <div class="row">
                <div class="mb-3">
                    <div class="col-auto">
                        <label for="region" class="form-label">Region: </label>
                    </div>
                    <div class="col-2">
                        <select id="region" class="form-select" aria-label="Region info">
                            <option value="IAD-PDX" selected>IAD/PDX</option>
                            <option value="DUB">DUB</option>
                            <option value="SYD">SYD</option>
                            <option value="YUL">YUL</option>
                        </select>
                    </div>
                </div>
                <div class="col-auto">
                    <label for="email" class="form-label">Email: </label>
                </div>
                <div class="w-100"></div>
                <div class="col-5">
                    <input type="text" id="email" class="form-control">
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="email-check">Check</button>`

    eContent.append(eForm);

    const checkBtn = eContent.querySelector('button');
    checkBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = {
            domain: domain,
            token: apiToken,
            region: eContent.querySelector('#region').value,
            email: eContent.querySelector('#email').value
        }


        const response = await window.axios.checkCommChannel(data);
    })

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);
}

function courseTemplate(e) {
    switch (e.target.id) {
        case 'reset-courses':
            resetCourses(e);
            break;
        case 'create-support-course':
            createSupportCourse(e);
            break;
        default:
            break;
    }
}

async function resetCourses(e) {
    const domain = `https://${document.querySelector('#domain').value}`;
    const apiToken = document.querySelector('#token').value;
    const eContent = document.querySelector('#endpoint-content');

    eContent.innerHTML = `
        <div>
            <h3>Reset Courses</h3>
        </div>
    `;

    const eForm = document.createElement('form');


    eForm.innerHTML = `
            <div class="row">
                <div class="mb-3">
                    <div class="col-auto">
                        <label for="reset-courses-area" class="form-label">Courses to be reset - useful when an Admin is needing to re-apply a template</label>
                        <textarea class="form-control" id="reset-courses-area" rows="3"></textarea>
                    </div>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="resetBtn">Reset</button>`

    eContent.append(eForm);

    const resetBtn = eContent.querySelector('button');
    resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const courses = eContent.querySelector('#reset-courses-area').value.split('\n').map(course => course.trim());
        console.log('The courses to reset are: ', courses);

        const data = {
            domain: domain,
            token: apiToken,
            courses: courses
        }

        try {
            const responses = await window.axios.resetCourses(data);

            for (let response of responses) {
                eContent.querySelector('#response-container').innerHTML += '<p>Course ID: ' + response.course_id + ' ' + response.status + '</p>';
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    })

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);
}

async function createSupportCourse(e) {
    const domain = `https://${document.querySelector('#domain').value}`;
    const apiToken = document.querySelector('#token').value;
    const eContent = document.querySelector('#endpoint-content');

    eContent.innerHTML = `
        <div>
            <h3>Create Support Course</h3>
        </div>
    `;

    const eForm = document.createElement('form');

    eForm.innerHTML = `
            <div class="row">
                <div class="mb-3">
                    <div class="col-6">
                        <label for="course-name" class="form-label">Course name</label>
                        <input type="text" class="form-control" id="course-name">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-publish" class="form-label">Publish</label>
                        <input type="checkbox" class="form-check-input" role="switch" id="course-publish">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-blueprint" class="form-label">Blueprint</label>
                        <input type="checkbox" class="form-check-input" role="switch" id="course-blueprint">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-users" class="form-label">Add Users</label>
                        <input type="checkbox" class="form-check-input" role="switch" id="course-add-users">
                    </div>
                    <div id="add-users-div" class="row hidden">
                        <div class="col-2">
                            <label for="course-add-students" class="form-label">Students</label>
                            <input type="text" class="form-control" role="switch" id="course-add-students">
                        </div>
                        <div class="col-2">
                            <label for="course-add-teachers" class="form-label">Teachers</label>
                            <input type="text" class="form-control" role="switch" id="course-add-teachers">
                        </div>
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-assignments" class="form-label">Add Assignments</label>
                        <input type="checkbox" class="form-check-input" role="switch" id="course-assignments">
                    </div>
                    <div id="add-assignments-div" class="row hidden">
                        <div class="col-2">
                            <label for="course-add-assignments" class="form-label">How many</label>
                            <input type="text" class="form-control" role="switch" id="course-add-assignments">
                        </div>
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-cq" class="form-label">Add Classic Quizzes</label>
                        <input type="checkbox" class="form-check-input" role="switch" id="course-add-cq">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-nq" class="form-label">Add New Quizzes</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-add-nq">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-discussions" class="form-label">Add Discussions</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-add-discussions">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-pages" class="form-label">Add Pages</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-add-pages">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-modules" class="form-label">Add Modules</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-add-modules">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-add-sections" class="form-label">Add Sections</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-add-sections">
                    </div>
                    <div class="col-auto form-check form-switch">
                        <label for="course-submissions" class="form-label">Create Submissions</label>
                        <input type="checkbox" class="form-check-input"  role="switch" id="course-submissions">
                    </div>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="createBtn">Create</button>`

    eContent.append(eForm);

    // currently disabled features
    eContent.querySelector('#course-blueprint').disabled = true;

    const addUsersToggle = eContent.querySelector('#course-add-users');
    addUsersToggle.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const addUsersDiv = eContent.querySelector('#add-users-div');
        if (e.target.checked) {
            addUsersDiv.classList.remove('hidden');
            addUsersDiv.classList.add('visible');
        } else {
            addUsersDiv.classList.remove('visible');
            addUsersDiv.classList.add('hidden');
        }
    });

    function checkIfEnabled() {
        const addUsersDiv = eContent.querySelector('#add-users-div');
        if (addUsersToggle.checked) {
            addUsersDiv.classList.remove('hidden');
            addUsersDiv.classList.add('visible');
        } else {
            addUsersDiv.classList.remove('visible');
            addUsersDiv.classList.add('hidden');
        }
    }

    const createBtn = eContent.querySelector('button');
    createBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const courseName = eContent.querySelector('#course-name').value;
        const coursePublishChbx = eContent.querySelector('#course-publish').checked;
        const courseBlueprintChbx = eContent.querySelector('#course-blueprint').checked;
        const courseAddUsersChbx = eContent.querySelector('#course-add-users').checked;
        const courseAddAssignmentsChbx = eContent.querySelector('#course-add-assignments').checked;
        const courseAddCQChbx = eContent.querySelector('#course-add-cq').checked;
        const courseAddNQChbx = eContent.querySelector('#course-add-nq').checked;
        const courseAddDiscussionsChbx = eContent.querySelector('#course-add-discussions').checked;
        const courseAddPagesChbx = eContent.querySelector('#course-add-pages').checked;
        const courseAddModulesChbx = eContent.querySelector('#course-add-modules').checked;
        const courseAddSectionsChbx = eContent.querySelector('#course-add-sections').checked;
        const courseSubmissionsChbx = eContent.querySelector('#course-submissions').checked;




        const data = {
            domain: domain,
            token: apiToken,
            course: {
                name: courseName,
                publish: coursePublishChbx,
                blueprint: courseBlueprintChbx,
                addUsers: courseAddUsersChbx,
                addAssignments: courseAddAssignmentsChbx,
                addCQ: courseAddCQChbx,
                addNQ: courseAddNQChbx,
                addDiscussions: courseAddDiscussionsChbx,
                addPages: courseAddPagesChbx,
                addModules: courseAddModulesChbx,
                addSections: courseAddSectionsChbx,
                submissions: courseSubmissionsChbx
            }
        }

        console.log('The data is: ', data);

        try {
            const response = await window.axios.createSupportCourse(data);
            eContent.querySelector('#response-container').innerHTML = '<p>Course ID: ' + response.course_id + ' ' + response.status + '</p>';
        } catch (error) {
            console.log('Error: ', error);
        }
    })

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response";
}