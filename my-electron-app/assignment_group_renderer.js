// ****************************************************
//
// AssignmentGroup Endpoints
//
// ****************************************************
function assignmentGroupTemplate(e) {
    switch (e.target.id) {
        case 'create-assignment-groups':
            assignmentGroupCreator(e);
            break;
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups(e);
            break;
        default:
            break;
    }
}

function emptyAssignmentGroups(e) {
    hideEndpoints(e)
    console.log('emptyAssignmentGroups');

    const eContent = document.querySelector('#endpoint-content');
    let deleteEmptyAssignmentGroupsForm = eContent.querySelector('#delete-empty-assignment-group-form');

    if (!deleteEmptyAssignmentGroupsForm) {
        deleteEmptyAssignmentGroupsForm = document.createElement('form');
        deleteEmptyAssignmentGroupsForm.id = 'delete-empty-assignment-group-form';


        // eContent.innerHTML = `
        //     <div>
        //         <h3>Delete Empty Assignment Groups</h3>
        //     </div>
        // `;

        // const eForm = document.createElement('form');

        deleteEmptyAssignmentGroupsForm.innerHTML = `
            <div>
                <h3>Delete Empty Assignment Groups</h3>
            </div>
            <div class="row align-items-center">
                <div class="col-auto">
                    <label class="form-label">Course</label>
                </div>
                <div class="w-100"></div>
                <div class="col-2">
                    <input id="course-id" type="text" class="form-control" aria-describedby="input-checker" />
                </div>
                <div class="col-auto" >
                    <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
                <div class="w-100"></div>
                <div class="col-auto">
                    <button id="action-btn" class="btn btn-primary mt-3">Check</button>
                </div>
            </div>
            <div hidden id="progress-div">
                <p id="progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="response-container" class="mt-5">
            </div>
        `;

        eContent.append(deleteEmptyAssignmentGroupsForm);
    }
    deleteEmptyAssignmentGroupsForm.hidden = false;

    const cID = document.querySelector('#course-id');
    checkCourseID(cID, eContent);

    // const eResponse = document.createElement('div');
    // eResponse.id = "response-container";
    // eResponse.classList.add('mt-5');
    // eContent.append(eResponse);

    const checkBtn = deleteEmptyAssignmentGroupsForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const course = cID.value.trim();
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        // clean environment
        progressDiv.hidden = false;
        progressBar.parentElement.hidden = true;
        progressBar.style.width = '0%';
        progressInfo.innerHTML = "Checking...";
        responseContainer.innerHTML = '';

        const requestData = {
            domain: domain,
            token: apiToken,
            course: course
        }

        let hasError = false;
        let emptyAssignmentGroups = [];
        try {
            emptyAssignmentGroups = await window.axios.getEmptyAssignmentGroups(requestData);
            progressInfo.innerHTML = 'Done'
        } catch (error) {
            hasError = true;
            errorHandler(error, progressInfo);
        } finally {
            checkBtn.disabled = false;
        }


        if (!hasError) {
            console.log('found emtpy groups', emptyAssignmentGroups.length);

            //const eContent = document.querySelector('#endpoint-content');
            responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${emptyAssignmentGroups.length} empty assignment groups.</span>
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

                cID.value = '';
                responseContainer.innerHTML = '';
                checkBtn.disabled = false;
                progressDiv.hidden = true;
                //clearData(courseID, responseContent);
            });

            const removeBtn = document.querySelector('#remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside remove');
                removeBtn.disabled = true;
                cancelBtn.disabled = true;

                const responseDetails = responseContainer.querySelector('#response-details');
                responseDetails.innerHTML = ``;

                progressBar.parentElement.hidden = false;
                progressInfo.innerHTML = `Removing empty assignment groups....`;

                const messageData = {
                    url: `https://${domain}/api/v1/courses/${course}/assignment_groups`,
                    token: apiToken,
                    content: emptyAssignmentGroups
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const result = await window.axios.deleteEmptyAssignmentGroups(messageData);

                    if (result.successful.length > 0) {
                        progressInfo.innerHTML = `Successfully removed ${result.successful.length} assignment group(s).`
                    }
                    if (result.failed.length > 0) {
                        progressBar.parentElement.hidden = true;
                        progressInfo.innerHTML += `Failed to remove ${result.failed.length} empty assignment group(s)`;
                        errorHandler({ message: `${result.failed[0].reason}` }, progressInfo);
                    }
                } catch (error) {
                    errorHandler(error, progressInfo);
                } finally {
                    removeBtn.disabled = false;
                    cancelBtn.disabled = false;
                    checkBtn.disabled = false;
                    progressBar.parentElement.hidden = true;
                }
                //const result = await window.axios.deleteTheThings(messageData);
            });
        }
    })
}

function assignmentGroupCreator(e) {
    hideEndpoints(e);
    let emptyGroups = [];

    const eContent = document.querySelector('#endpoint-content');
    let createAssignmentGroupForm = eContent.querySelector('#create-assignment-group-form');

    if (!createAssignmentGroupForm) {
        createAssignmentGroupForm = document.createElement('form');
        createAssignmentGroupForm.id = 'create-assignment-group-form';


        // eContent.innerHTML = `
        //     <div>
        //         <h3>Create Assignment Groups</h3>
        //     </div>
        // `;

        // const eForm = document.createElement('form');

        createAssignmentGroupForm.innerHTML = `
            <div>
                <h3>Create Assignment Groups</h3>
            </div>
            <div class="row align-items-center">
                <div class="col-2">
                    <label class="form-label">Course</label>
                    <input id="course-id" type="text" class="form-control" aria-describedby="input-checker" />
                </div>
                <div class="col-auto" >
                    <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
                <div class="col-2">
                    <label class="form-label">How many</label>
                    <input id="assignment-group-number" type="text" class="form-control" value="1">
                </div>
                <div class="w-100"></div>
                <div class="col-auto">
                    <button id="action-btn" class="btn btn-primary mt-3">create</button>
                </div>
            </div>
            <div hidden id="progress-div">
                <p id="progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="response-container" class="mt-5">
            </div>
        `;

        eContent.append(createAssignmentGroupForm);
    }
    createAssignmentGroupForm.hidden = false;

    // validate course id
    const cID = eContent.querySelector('#course-id');
    checkCourseID(cID, eContent);

    const createBtn = eContent.querySelector('#action-btn');
    createBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        createBtn.disabled = true;

        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const courseID = cID.value.trim();
        const number = eContent.querySelector('#assignment-group-number').value;
        const responseContainer = eContent.querySelector('#response-container');
        const progressDiv = eContent.querySelector('#progress-div');
        const progressInfo = eContent.querySelector('#progress-info');
        const progressBar = eContent.querySelector('.progress-bar');


        progressDiv.hidden = false;
        progressInfo.innerHTML = '';

        const data = {
            domain: domain,
            token: token,
            course: courseID,
            number: number
        };

        window.progressAPI.onUpdateProgress((progress) => {
            progressBar.style.width = `${progress}%`;
        });

        try {
            const response = await window.axios.createAssignmentGroups(data);
            if (response.successful.length > 0) {
                progressInfo.innerHTML = `Successfully created ${response.successful.length} assignment groups.`;
            }
            if (response.failed.length > 0) {
                progressInfo.innerHTML += `Failed to create ${response.failed.length} assignments.`;
                progressBar.parentElement.hidden = true;
                for (let failure of response.failed) {
                    errorHandler({ message: `${failure.reason}` }, progressInfo);
                }
            }
        } catch (error) {
            progressBar.parentElement.hidden = true;
            errorHandler(error, progressInfo);
        } finally {
            createBtn.disabled = false;
        }
    });
}