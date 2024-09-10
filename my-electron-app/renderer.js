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

// ****************************************************
//
// Assignment Endpoints
//
// ****************************************************

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
        case 'delete-unpublished-assignments':
            unpublishedAssignments();
            break;
        case 'delete-nonmodule-assignments':
            nonModuleAssignments();
            break;
        case 'move-assignments':
            moveAssignmentsToSingleGroup();
            break;
        default:
            break;
    }
}

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
                    <input id="course-id" type="text" class="form-control" aria-describedby="input-checker" />
                </div>
                <div class="col-auto" >
                    <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
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
                <button id="action-btn" class="btn btn-primary mt-3">Create</button>
            </div>
        </div>
        <div hidden id="progress-div">
            <p id="progress-info"></p>
            <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>
        <div id="response-container" class="mt-3">
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

    const courseID = document.querySelector('#course-id');
    checkCourseID(courseID, eContent);

    const createBtn = eForm.querySelector('#action-btn');
    createBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        createBtn.disabled = true;

        // get values and inputs
        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain');
        const apiToken = document.querySelector('#token');
        const checkedSubTypes = submissionTypes.querySelectorAll('input[type="checkbox"]:checked');
        const checkedSubmissionTypes = Array.from(checkedSubTypes).map((subType) => {
            return subType.id.split('-')[1];
        });
        const assignmentNumber = document.querySelector('#assignment-number').value.trim();
        const assignmentPoints = document.querySelector('#assignment-points');
        const publish = document.querySelector('#assignment-publish').checked;
        const peerReviews = document.querySelector('#assignment-peer').checked;
        const anonymous = document.querySelector('#assignment-anonymous').checked;
        const gradeType = document.querySelector('#assignment-grade-type').value;

        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        // clean environment
        progressDiv.hidden = false;
        progressBar.style.width = '0%';
        progressInfo.innerHTML = '';

        // data to be used to create assignments
        const requestData = {
            domain: domain.value.trim(),
            token: apiToken.value.trim(),
            course: courseID.value.trim(),
            number: parseInt(assignmentNumber),
            points: parseInt(assignmentPoints.value.trim()),
            publish: publish ? 'published' : 'unpublished',
            peer_reviews: peerReviews,
            anonymous: anonymous,
            grade_type: gradeType,
            submissionTypes: checkedSubmissionTypes
        }


        window.progressAPI.onUpdateProgress((progress) => {
            progressBar.style.width = `${progress}%`;
        });

        try {
            const createAssignmentResponse = await window.axios.createAssignments(requestData);
            if (createAssignmentResponse.successful.length > 0) {
                progressInfo.innerHTML = `Successfully created ${createAssignmentResponse.successful.length} assignments.`;
            }
            if (createAssignmentResponse.failed.length > 0) {
                progressInfo.innerHTML += `Failed to create ${createAssignmentResponse.failed.length} assignments.`;
                progressBar.parentElement.hidden = true;
                errorHandler({ message: `${createAssignmentResponse.failed[0].reason}` }, progressInfo);
                // for (let failure of createAssignmentResponse.failed) {
                //     errorHandler({ message: `${failure.reason}` }, progressInfo);
                // }
                // <span class='error'>${createAssignmentResponse.failed[0].reason}.</span>;
            }
        } catch (error) {
            progressBar.parentElement.hidden = true;
            errorHandler(error, progressInfo);
        } finally {
            createBtn.disabled = false;
        }


        // const assignments = { success: 0, failed: 0 };

        // const createAssignment = async () => {
        //     try {
        //         // create assignments and returns true if successful and false if failed
        //         const result = await window.axios.createAssignments(requestData);
        //         if (result) {
        //             assignments.success++;
        //         } else {
        //             assignments.failed++;
        //         }
        //     } catch (error) {
        //         console.error('Error creating assignments', error);
        //         assignments.failed++;
        //     } finally {
        //         updateProgress();
        //     }
        // }

        // const totalRequests = parseInt(assignmentNumber);
        // let completedRequests = 0;

        // const updateProgress = () => {
        //     completedRequests++;
        //     progressBar.style.width = `${(completedRequests / totalRequests) * 100}%`;
        // }

        // const requests = [];
        // for (let i = 0; i < totalRequests; i++) {
        //     requests.push(createAssignment());
        // }

        // await Promise.allSettled(requests);
        // console.log('All requests completed');
        // progressBar.style.width = '100%'; // if for some reason the progress bar doesn't reach 100%

        // // for (let i = 0; i < assignmentNumber; i++) {
        // //     try {
        // //         const result = await window.axios.createAssignments(requestData);
        // //         if (result) {
        // //             assignments.success++;
        // //         } else {
        // //             assignments.failed++;
        // //         }
        // //         progressBar.style.width = `${(i / assignmentNumber) * 100}%`;
        // //     } catch (error) {
        // //         console.error('Error creating assignments', error);
        // //         assignments.failed++;
        // //     }
        // // }
        // // progressBar.style.width = '100%';

        // const progressInfo = eContent.querySelector('#progress-div p:first-of-type');
        // if (assignments.success > 0) {
        //     progressInfo.innerHTML = `Successfully created ${assignments.success} assignments.`;

        // }
        // if (assignments.failed > 0) {
        //     responseContainer.innerHTML += `Failed to create ${assignments.failed} assignments.`;

        // }
    });
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
                <input id="course-id" type="text" class="form-control" aria-describedby="input-checker" />
            </div>
            <div class="col-auto" >
                <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
            </div>
            <div class="w-100"></div> 
            <div class="col-auto form-check form-switch mt-3 ms-3">
                <input id="graded-submissions" class="form-check-input" type="checkbox" role="switch" />
                <label for="graded-submissions" class="form-check-label">Delete assignments with grades</label>
                    <div id="graded-help" class="form-text">
                        (otherwise this will check for assignments with no submissions <em>AND</em> no grades)
                    </div>
            </div>
            <div class="col-auto">

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



    eContent.append(eForm);

    const courseID = document.querySelector('#course-id');
    checkCourseID(courseID, eContent);

    const checkBtn = eForm.querySelector('#action-btn');
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
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');


        // clean environment
        responseContainer.innerHTML = '';
        progressDiv.hidden = false;
        progressBar.parentElement.hidden = true;
        progressBar.style.width = '0%';
        progressInfo.innerHTML = 'Checking...';


        const requestData = {
            domain: domain.value.trim(),
            token: apiToken.value.trim(),
            course: courseID.value.trim(),
            graded: gradedSubmissions
        }

        let hasError = false;
        try {
            assignments = await window.axios.getNoSubmissionAssignments(requestData);
            progressInfo.innerHTML = 'Done';
        }
        catch (error) {
            errorHandler(error, progressInfo)
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }

        if (!hasError) {
            console.log(`found ${assignments.length} assignments with no submissions`);


            //const eContent = document.querySelector('#endpoint-content');
            let gradedText = gradedSubmissions ? 'no submissions.' : 'no submissions or grades.';
            responseContainer.innerHTML = `
                        <div>
                            <div class="row align-items-center">
                                <div id="response-details" class="col-auto">
                                    <span>Found ${assignments.length} assignments with ${gradedText}</span>
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

            const responseDetails = responseContainer.querySelector('#response-details');

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

                responseDetails.innerHTML = ``;
                progressBar.parentElement.hidden = false;
                progressInfo.innerHTML = `Removing ${assignments.length} assignments...`;

                const assignmentIDs = assignments.map((assignment) => {
                    return {
                        name: assignment.name,
                        id: assignment.id
                    };
                });

                const messageData = {
                    url: `https://${domain.value}/api/v1/courses/${courseID.value.trim()}/assignments`,
                    token: apiToken.value,
                    number: assignmentIDs.length,
                    assignments: assignmentIDs
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteNoSubmissionASsignments = await window.axios.deleteAssignments(messageData);

                    if (deleteNoSubmissionASsignments.successful.length > 0) {
                        progressInfo.innerHTML = `Successfully removed ${deleteNoSubmissionASsignments.successful.length} assignments.`;
                    }
                    if (deleteNoSubmissionASsignments.failed.length > 0) {
                        progressInfo.innerHTML = `Failed to remove ${deleteNoSubmissionASsignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, progressInfo)
                } finally {
                    checkBtn.disabled = false;
                }
            });
        }

        // console.error(error)
        // const lastIndex = error.message.lastIndexOf(':');
        // let errorInfo = '';
        // const statusCode = error.message.match(/(?<=status code )[0-9]+/);
        // if (statusCode) {
        //     switch (statusCode[0]) {
        //         case '404':
        //             errorInfo = 'Check your inputs to make sure they\'re valid.';
        //             break;
        //         case '403':
        //             errorInfo = 'Check to make sure you have permissions for the request and try again.';
        //             break;
        //         default:
        //             errorInfo = 'Message Caleb and tell him to fix it.'
        //             break;
        //     }
        // }
        // responseContainer.innerHTML = `<p>There was an error: <span class="error">${error.message.slice(lastIndex + 1)}</span></p><p>${errorInfo}</p>`;
        // checkBtn.disabled = false;


    });
}

function unpublishedAssignments() {
    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Delete All Unpublished Assignments</h3>
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
        <div id="response-container" class="mt-3">
        </div>
    `;

    eContent.append(eForm);


    const courseID = document.querySelector('#course-id');
    checkCourseID(courseID, eContent);

    const checkBtn = eForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const responseContainer = eContent.querySelector('#response-container');
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        // clean environment
        progressDiv.hidden = false;
        progressBar.style.width = '0%';
        progressBar.parentElement.hidden = true;
        progressInfo.innerHTML = "Checking...";

        const requestData = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let hasError = false;
        try {
            assignments = await window.axios.getUnpublishedAssignments(requestData);
            progressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, progressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }


        if (!hasError) {
            console.log('found assignments', assignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${assignments.length} unpublished assignments.</span>
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

            const responseDetails = responseContainer.querySelector('#response-details');

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

                // responseDetails.innerHTML = `Removing ${assignments.length} assignments...`;
                responseDetails.innerHTML = ``;
                progressInfo.innerHTML = `Deleting ${assignments.length} assignments...`;
                progressBar.style.width = '0%';
                progressBar.parentElement.hidden = false;


                // remapping to only include the id from the graphql response
                const assignmentIDs = assignments.map((assignment) => {
                    return {
                        id: assignment._id
                    };
                });

                const messageData = {
                    url: `https://${domain}/api/v1/courses/${courseID.value.trim()}/assignments`,
                    token: apiToken,
                    number: assignmentIDs.length,
                    assignments: assignmentIDs
                }

                // const successful = [];
                // const failed = [];


                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteUnpublishedAssignments = await window.axios.deleteAssignments(messageData);
                    if (deleteUnpublishedAssignments.successful.length > 0) {
                        progressInfo.innerHTML = `Successfully removed ${deleteUnpublishedAssignments.successful.length} assignments.`;
                    }
                    if (deleteUnpublishedAssignments.failed.length > 0) {
                        progressInfo.innerHTML = `Failed to remove ${deleteUnpublishedAssignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, progressInfo);
                } finally {
                    checkBtn.disabled = false;
                }

                // const deleteUnpublishedAssignments = async (data) => {
                //     try {
                //         // const response = await window.axios.deleteTheThings(messageData);
                //         const response = await window.axios.deleteAssignment(data);
                //         return response;
                //     } catch (error) {
                //         console.error('Error deleting unpublished assignments', error);
                //         throw error;
                //     } finally {
                //         updateProgress();
                //     }
                // }

                //     const totalRequests = assignmentIDs.length;
                //     let completedRequests = 0;

                //     const updateProgress = () => {
                //         completedRequests++;
                //         progressBar.style.width = `${(completedRequests / totalRequests) * 50}%`;
                //     }

                //     let requests = assignmentIDs.map(assignment => {
                //         const messageDataCopy = { ...messageData, assignment: assignment.id };
                //         return () => deleteUnpublishedAssignments(messageDataCopy);
                //     });

                //     const processBatchRequests = async (requests, batchSize, timeDelay) => {
                //         const results = [];
                //         for (let i = 0; i < requests.length; i += batchSize) {
                //             const batch = requests.slice(i, i + batchSize);
                //             const batchResults = await Promise.allSettled(batch.map((request) => request()));
                //             results.push(...batchResults);
                //             if (i + batchSize < requests.length) {
                //                 await waitFunc(timeDelay);
                //             }
                //         }
                //         return results;
                //     }

                //     let counter = 0;
                //     const finalResults = {
                //         successful: [],
                //         failed: []
                //     }

                //     // looping through the requests until all are successful or until 3 attempts
                //     do {
                //         const response = await processBatchRequests(requests, batchSize, timeDelay);

                //         // checking for successful requests and mapping them to a new array
                //         successful = response.filter((result) => {
                //             if (result.status === 'fulfilled') {
                //                 return result;
                //             }
                //         }).map((result) => {
                //             return {
                //                 status: result.status,
                //                 id: result.value
                //             }
                //         });
                //         finalResults.successful.push(...successful);

                //         // checking for failed requests and mapping them to a new array
                //         failed = response.filter((result) => {
                //             if (result.status === 'rejected') {
                //                 return result
                //             }
                //         }).map((result) => {
                //             return {
                //                 status: result.status,
                //                 reason: result.reason.message,
                //                 id: result.reason.config.url.split('/').pop()
                //             }
                //         });

                //         // removing successful requests from the failed requests
                //         finalResults.successful.forEach((success) => {
                //             finalResults.failed = finalResults.failed.filter((fail) => {
                //                 return fail.id != success.id;
                //             });
                //         });

                //         requests = failed;
                //         counter++;
                //     } while (requests.length > 0 && counter < 3);


                //     // await Promise.allSettled(requests);
                //     progressBar.style.width = '100%';

                //     if (finalResults.successful.length > 0) {
                //         responseContainer.innerHTML = `Successfully removed ${finalResults.successful.length} assignments.`

                //     }
                //     if (finalResults.failed.length > 0) {
                //         for (let fail of finalResults.failed) {
                //             responseContainer.innerHTML += `<p>Failed to remove assignment: ${fail.id} "${fail.reason}"</p>`;
                //         }
                // }
            });
        }


        // } else {
        //     document.querySelector('#courseChecker').style.display = 'inline';
        //     checkBtn.disabled = false;
        // }
    });
}

function nonModuleAssignments() {
    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    // setHeader('Delete All Assignments Not in a Module', eContent);
    // createForm('deleteNonModuleAssignments', eContent);

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
                <input id="course" type="text" class="form-control" aria-describedby="input-checker" />
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

    eContent.append(eForm);

    //checks for valid input in the course id field

    const courseID = eContent.querySelector('#course');
    checkCourseID(courseID, eContent);

    const checkBtn = eForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        // clean environment
        progressDiv.hidden = false;
        progressBar.parentElement.hidden = true;
        progressBar.style.width = '0%';
        progressInfo.innerHTML = "Checking...";

        const requestData = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let hasError = false;
        try {
            assignments = await window.axios.getNonModuleAssignments(requestData);
            progressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, progressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }

        if (!hasError) {
            console.log('found assignments', assignments.length);

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
                responseDetails.innerHTML = ``;

                progressBar.parentElement.hidden = false;
                progressInfo.innerHTML = `Removing ${assignments.length} assignments...`;

                // const messageData = {
                //     url: `https://${domain}/api/v1/courses/${courseID}/assignments`,
                //     token: apiToken,
                //     content: assignments
                // }

                const messageData = {
                    url: `https://${domain}/api/v1/courses/${courseID.value.trim()}/assignments`,
                    token: apiToken,
                    number: assignments.length,
                    assignments: assignments
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteNonModuleAssignments = await window.axios.deleteAssignments(messageData);
                    if (deleteNonModuleAssignments.successful.length > 0) {
                        progressInfo.innerHTML = `Successfully removed ${deleteNonModuleAssignments.successful.length} assignments.`;
                    }
                    if (deleteNonModuleAssignments.failed.length > 0) {
                        progressInfo.innerHTML = `Failed to remove ${deleteNonModuleAssignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, progressInfo);
                } finally {
                    checkBtn.disabled = false;
                }
            });
        }
    })
}

function moveAssignmentsToSingleGroup() {
    console.log('renderer > moveAssignmentsToSingleGroup');

    // create form
    const eContent = document.querySelector('#endpoint-content');
    eContent.innerHTML = `
        <div>
            <h3>Move Assignments to a Single Group</h3>
        </div>
    `;
    // setHeader('Move Assignments to Single Group', eContent);
    // createForm('moveAssignmentsToSingleGroup', eContent);

    // find someway to generate the form

    const eForm = document.createElement('form');
    eForm.innerHTML = `
        <div class="row align-items-center">
            <div class="col-auto">
                <label class="form-label">Course</label>
            </div>
            <div class="w-100"></div>
            <div class="col-2">
                <input id="course" type="text" class="form-control" aria-describedby="input-checker" />
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

    eContent.append(eForm);

    // Objectives:
    // 1. Get inputs
    // 2. Get all assignments from a course
    // 3. Get the first assignment group from the first assignment
    // 4. Loop through all assignments and move them to the first assignment group

    const courseID = document.querySelector('#course');
    checkCourseID(courseID, eContent);

    const checkBtn = eForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const responseContainer = eContent.querySelector('#response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = progressDiv.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        // clean environment
        progressDiv.hidden = false;
        progressBar.parentElement.hidden = true;
        progressBar.style.width = '0%';
        progressInfo.innerHTML = "Checking...";

        const data = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let assignments = [];
        let hasError = false;
        try {
            assignments = await window.axios.getAssignmentsToMove(data);
            progressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, progressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;

        }

        if (!hasError) {
            let assignmentGroup = assignments[0].assignmentGroupId;

            console.log('found assignments', assignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            responseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="response-details" class="col-auto">
                            <span>Found ${assignments.length} assignments in the course. Do you want to move them all to a since assignment group?</span>
                        </div>

                        <div class="w-100"></div>

                        <div class="col-2">
                            <button id="move-btn" type="button" class="btn btn-danger">Move</button>
                        </div>
                        <div class="col-2">
                            <button id="cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>    
            `;

            const responseDetails = responseContainer.querySelector('#response-details');

            const cancelBtn = document.querySelector('#cancel-btn');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                responseContainer.innerHTML = '';
                checkBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const moveBtn = document.querySelector('#move-btn');
            moveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside move');

                responseDetails.innerHTML = '';
                progressBar.parentElement.hidden = false;
                progressInfo.innerHTML = `Moving ${assignments.length} assignments...`;

                // const messageData = {
                //     url: `https://${domain}/api/v1/courses/${courseID}/assignments`,
                //     token: apiToken,
                //     content: assignments
                // }

                const messageData = {
                    url: `https://${domain}/api/v1/courses/${courseID.value.trim()}/assignments`,
                    token: apiToken,
                    number: assignments.length,
                    assignments: assignments,
                    groupID: assignmentGroup
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const moveAssignmentsToSingleGroup = await window.axios.moveAssignmentsToSingleGroup(messageData);

                    if (moveAssignmentsToSingleGroup.successful.length > 0) {
                        progressInfo.innerHTML = `Successfully removed ${moveAssignmentsToSingleGroup.successful.length} assignments.`;
                    }
                    if (moveAssignmentsToSingleGroup.failed.length > 0) {
                        progressInfo.innerHTML = `Failed to remove ${moveAssignmentsToSingleGroup.failed.length} assignments.`;
                    }
                    checkBtn.disabled = false;
                } catch (error) {
                    errorHandler(error, progressInfo)
                } finally {
                    checkBtn.disabled = false;
                }
            });
        }
    });
}

// ****************************************************
//
// AssignmentGroup Endpoints
//
// ****************************************************

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

function emptyAssignmentGroups() {
    console.log('emptyAssignmentGroups');

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

    eContent.append(eForm);

    const cID = document.querySelector('#course-id');
    checkCourseID(cID, eContent);

    // const eResponse = document.createElement('div');
    // eResponse.id = "response-container";
    // eResponse.classList.add('mt-5');
    // eContent.append(eResponse);

    const checkBtn = eForm.querySelector('#action-btn');
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

    eContent.append(eForm);

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
                <input type="text" id="user-id" class="form-control" aria-describedby="input-checker">
            </div>
            <div class="col-auto" >
                <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
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
        <button type="button" class="btn btn-primary mt-3" id="action-btn">Search</button>
        <div id="response-container" class="mt-5">
        </div>
        `;

    eContent.append(eForm);

    const uID = document.querySelector('#user-id');
    checkCourseID(uID, eContent);

    const searchBtn = eContent.querySelector('#action-btn');
    searchBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();


        console.log('renderer.js > getPageViews > searchBtn');



        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const userID = parseInt(eContent.querySelector('#user-id').value.trim());
        const startDate = eContent.querySelector('#start-date').value;
        const endDate = eContent.querySelector('#end-date').value;
        const responseContainer = document.querySelector('#response-container');

        const searchData = {
            domain: domain,
            token: apiToken,
            user: userID,
            start: startDate,
            end: endDate
        };

        searchBtn.disabled = true;

        // const pageViews = await window.axios.getPageViews(searchData);
        try {
            responseContainer.innerHTML = 'Searching...';
            const response = await window.axios.getPageViews(searchData);
            if (response === 'cancelled') {
                responseContainer.innerHTML = 'Page views found, saving was cancelled.';
            } else if (response) {
                responseContainer.innerHTML = 'Page Views saved.';
            } else {
                responseContainer.innerHTML = 'No page views found.';
            }
        } catch (error) {
            responseContainer.innerHTML = '';
            errorHandler(error, responseContainer);
        } finally {
            searchBtn.disabled = false;
        }


        // if (!result) {
        //     searchBtn.disabled = false;
        //     responseContainer.innerHTML = 'Search failed. Check domain, token or user id.';
        // } else if (result === 'empty') {
        //     searchBtn.disabled = false;
        //     responseContainer.innerHTML = 'No page views found for user.';
        // } else if (result === 'cancelled') {
        //     searchBtn.disabled = false;
        //     responseContainer.innerHTML = 'Save cancelled.';
        // } else {
        //     responseContainer.innerHTML = 'Page views saved to file.';
        // }

    });
}

async function conversationTemplate(e) {
    // const eContent = document.querySelector('#endpoint-content');
    // eContent.innerHTML = '';

    switch (e.target.id) {
        case 'delete-conversations-subject':
            deleteConvos(e);
            break;
        case 'download-conversations-csv': // Not Complete
            downloadConvos(e);
            break;
        case 'gc-between-users': // Not complete
            getConvos(e);
            break;
        default:
            break;
    }
};

async function deleteConvos(e) {
    const eContent = document.querySelector('#endpoint-content');

    eContent.innerHTML = `
        <div>
            <h3>Delete Specific Conversations</h3>
        </div>
    `;

    const eForm = document.createElement('form');
    eForm.innerHTML = `
            <div class="row">
                <div class="col-auto">
                    <label for="input-checker" class="form-label">User ID who sent the message</label>
                </div>
                <div class="w-100"></div>
                <div class="col-2">
                    <input type="text" id="user-id" class="form-control">
                </div>
                <div class="col-auto">
                    <span id="input-checker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
            </div>
            </div>
        <div class="row mt-3">
            <div class="col-auto">
                <label for="conversation-subject" class="form-label">Message Subject</label>
            </div>
            <div class="w-100"></div>
            <div class="col-6">
                <input id="conversation-subject" type="text" class="form-control" aria-describedby="messageHelper">
                <div id="messageHelper" class="form-text">
                    <span>NOTE: This is case sensative and must match exactly</span>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="action-btn" disabled>Search</button>
        <div hidden id="progress-div">
            <p id="progress-info"></p>
            <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>
        <div id="response-container" class="mt-5"></div>`

    eContent.append(eForm);

    const uID = eContent.querySelector('#user-id');
    checkCourseID(uID, eContent);

    // 1. Get messages
    // 2. Filter messages
    // 3. Delete messaages ( or cancel )
    // 4. If filter more go back to 2


    // ************************************
    // starting step 1. Getting messages
    //
    // ************************************

    const searchBtn = document.querySelector('#action-btn');
    searchBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        searchBtn.disabled = true;


        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const convoSubject = document.querySelector('#conversation-subject');
        const userID = uID.value.trim();
        const responseContainer = document.querySelector('#response-container');
        const progressDiv = eContent.querySelector('#progress-div');
        const progressBar = eContent.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        progressBar.parentElement.hidden = true;
        progressBar.style.width = '0%';
        progressDiv.hidden = false;

        // console.log(`Subject: ${convoSubject.value}, User_ID: ${userID.value}`);

        // const responseContainer = document.querySelector('#response-container');
        // responseContainer.innerHTML = 'Searching....';

        const searchData = {
            domain: domain,
            token: apiToken,
            subject: convoSubject.value,
            user_id: userID
        };

        console.log(searchData);

        let messages
        let hasError = false;
        try {
            progressInfo.innerHTML = 'Searching....';
            messages = await window.axios.getConvos(searchData);
        } catch (error) {
            hasError = true;
            errorHandler(error, progressInfo);
        } finally {
            searchBtn.disabled = false;
            progressInfo.innerHTML = `Done. Found ${messages.length} conversations.`
        }

        // if (!messages) {
        //     //alert('Query failed, check domain, token or user id.');

        //     searchBtn.disabled = false;
        //     responseContainer.innerHTML = 'Search Failed. Check domain, token or user id.';
        // } else {
        if (!hasError) {

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
                <div>
                    <div class="row align-items-start">
                        <div id="response-details" class="col-auto">
                        </div>

                        <div class="w-100"></div>

                        <div class="col-2">
                            <button id="remove-btn" type="button" class="btn btn-danger">Remove</button>
                        </div>
                        <div class="col-2">
                            <button id="cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                        </div>
                        <div class="col-3">
                            <button id="csv-btn" type="button" class="btn btn-secondary" aria-describedby="sendcsv-check">Send to CSV</button>
                            <div id="sendcsv-check" class="form-text">
                                NOTE: This only sends the message subject and conversation ID to the csv
                            </div>
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
                // const responseDetails = responseContainer.querySelector('#response-details');
                // responseDetails.innerHTML = `Removing ${messages.length} conversations...`;

                // const messageIDs = messages.map((message) => {
                //     return message.node.conversation;
                // });

                progressInfo.innerHTML += `<p>Removing ${messages.length} conversations.</p>`;
                progressBar.parentElement.hidden = false;
                const messageData = {
                    domain: domain,
                    token: apiToken,
                    messages: messages
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                try {
                    const result = await window.axios.deleteConvos(messageData);
                    if (result.successful.length > 0) {
                        progressInfo.innerHTML += `<p>Successfully removed ${result.successful.length} messages</p>`
                    }
                    if (result.failed.length > 0) {
                        progressBar.parentElement.hidden = true;
                        progressInfo.innerHTML += `Failed to remove ${result.failed.length} messages`;
                        errorHandler({ message: `${result.failed[0].reason}` }, progressInfo);
                    }
                } catch (error) {
                    errorHandler(error, progressInfo);
                }
            });

            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // clearData(userID, convoSubject, responseContainer, searchBtn);
                uID.value = '';
                convoSubject.value = '';
                progressInfo.innerHTML = '';
                responseContainer.innerHTML = '';
                searchBtn.disabled = true;
                progressDiv.hidden = true;
            });

            sendToCSV.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside sendTocCSV');
                //console.log(filteredMessages);

                window.csv.sendToCSV(messages);
            })
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

    // const eHeader = document.createElement('div');
    // eHeader.innerHTML = `<h3>${e.target.id}</h3>`;
    const eContent = document.querySelector('#endpoint-content');
    // eContent.append(eHeader);
    eContent.innerHTML = `
        <div>
            <h3>Check suppression and bounce list</h3>
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
                            <option value="iad_pdx" selected>IAD/PDX</option>
                            <option value="dub_fra">DUB/FRA</option>
                            <option value="syd_sin">SYD/SIN</option>
                            <option value="yul" selected>YUL</option>
                        </select>
                    </div>
                </div>
                <div id="email-options">
                    <div class="form-check form-switch">
                        <label class="form-label" for="single-email-chkbx">Single Email</label>
                        <input id="single-email-chkbx" type="checkbox" class="form-check-input" role="switch">
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-label" for="domain-email-chkbx">Domain</label>
                        <input id="domain-email-chkbx" type="checkbox" class="form-check-input" role="switch">
                    </div>
                </div>
                <div class="">
                    <div class="col-auto">
                        <label id="email-label" for="email" class="form-label">Email</label>
                    </div>
                    <div class="w-100"></div>
                    <div class="col-5">
                        <input disabled type="text" id="email" class="form-control" aria-describedby="email-form-text">
                    </div>
                    <div class="form-text" id="email-form-text">
                        Enter the full email address you want to check
                    </div>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="email-check">Check</button>
        <div id="loading-wheel">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div id="response-container" class="mt-5">
        </div>
        `

    eContent.append(eForm);

    function handleQueryType(e) {
        const emailInput = eContent.querySelector('#email');
        const formMessgae = eContent.querySelector('#email-form-text')
        const emailLabel = eContent.querySelector('#email-label')

        emailInput.disabled = false;
        if (e.target.id === 'single-email-chkbx') {
            eContent.querySelector('#domain-email-chkbx').checked = false;
            formMessgae.innerHTML = "Enter the full email address you want to check";
            emailLabel.innerHTML = "Email";
        } else {
            eContent.querySelector('#single-email-chkbx').checked = false;
            formMessgae.innerHTML = "Enter the domain you want to check. You can include the wildcard \'*\' character, for example \"ins*e*u\" will match \"myemail@instru.edu.com.au\" as well as \"something@instructure.ecu\". <p><p>NOTE: This queries the entire aws region and will take some time, we're talking hours in some cases.</p></p>";
            emailLabel.innerHTML = "Domain";
        }
    }

    const emailOptions = eContent.querySelector('#email-options');
    emailOptions.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        handleQueryType(e);
    })


    const checkBtn = eContent.querySelector('button');
    checkBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkBtn.disabled = true;

        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const region = eContent.querySelector('#region').value;
        const email = eContent.querySelector('#email').value.trim();
        const responseContainer = eContent.querySelector('#response-container');
        const progresDiv = eContent.querySelector('#progress-div');
        const progressBar = eContent.querySelector('.progress-bar');
        const progressInfo = eContent.querySelector('#progress-info');

        responseContainer.innerHTML = '';

        const options = eContent.querySelectorAll('input[type="checkbox"]');
        const checkedOption = Array.from(options).find(checkbox => checkbox.checked);
        const option = checkedOption ? checkedOption.id.split('-')[0] : undefined;

        const data = {
            domain: domain,
            token: apiToken,
            region: region,
            pattern: email
        }

        let response;
        let hasError = false;
        if (option === 'single') {
            try {
                responseContainer.innerHTML = 'Checking email....';
                response = await window.axios.checkCommChannel(data);
            } catch (error) {
                hasError = true;
                errorHandler(error, responseContainer);
            } finally {
                checkBtn.disabled = false;
                responseContainer.innerHTML += '<p>Done.</p>';
            }

            if (!hasError) {
                responseContainer.innerHTML += `<p>Suppressed: <span style="color: ${response.suppressed ? 'red' : 'green'}">${response.suppressed ? 'Yes' : 'No'}</span></p>`;
                responseContainer.innerHTML += `<p>Bounced: <span style="color: ${response.bounced ? 'red' : 'green'}">${response.bounced ? 'Yes' : 'No'}</span></p>`;
            }
        } else {
            progresDiv.hidden = false;
            progressBar.style.width = '0%';
            let progress = 0;
            try {
                // just some status to show it's still doing something
                progressBar.innerHTML = `
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`
                responseContainer.innerHTML = 'Checking domain pattern....';
                response = await window.axios.checkCommDomain(data);
            } catch (error) {
                checkBtn.disabled = false;
                errorHandler(error, responseContainer);
            }
        }
    })

    // adding response container
    // const eResponse = document.createElement('div');
    // eResponse.id = "response-container";
    // eResponse.classList.add('mt-5');
    // eContent.append(eResponse);
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
        } finally {
            checkBtn.disabled = false;
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
        } finally {
            checkBtn.disabled = false;
        }
    })

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response";
}

function setHeader(header, eContent) {
    let eHeader = eContent.querySelector(`h3`);

    if (!eHeader) {
        const headerDiv = document.createElement('div');
        eHeader = document.createElement('h3');
        headerDiv.append(eHeader);
        eContent.append(headerDiv);
    }

    eHeader.innerHTML = header;
}
// create a boilerplate form based on what the endpoint needs
// the parameter is the div for the 'endpoint-content' and the endpoint name
// current valid endpoints are:
// -- createAssignments, deleteNoSubmissionAssignments, deleteUnpublishedAssignments,
// -- deleteNonModuleAssignments, moveAssignmentsToSingleGroup
function createForm(endpoint, eContent) {
    switch (endpoint) {
        case 'createAssignments':
            createAssignments(eContent);
            break;
        case 'deleteNoSubmissionAssignments':
            deleteNoSubmissionAssignments(eContent);
            break;
        case 'deleteUnpublishedAssignments':
        case 'deleteNonModuleAssignments':
        case 'moveAssignmentsToSingleGroup':
            assignmentCourse(eContent);
            break;
        default:
            break;
    }
}

function assignmentCourse(eContent) {
    let eForm = eContent.querySelector('form');
    if (!eForm) {
        eForm = document.createElement('form');

        eForm.innerHTML = `
        <div class="row align-items-center">
            <div class="col-auto">
                <label class="form-label">Course</label>
            </div>
            <div class="w-100"></div>
            <div class="col-2">
                <input id="course" type="text" class="form-control" aria-describedby="input-checker" />
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

        eContent.append(eForm);
    }


}

// check if the course ID is a number
function checkCourseID(courseID, eContent) {
    if (courseID != null) {
        courseID.addEventListener('input', (e) => {
            const courseChecker = eContent.querySelector(`#input-checker`);
            if (!isNaN(Number(courseID.value)) || courseID.value === '') {
                courseChecker.style.display = 'none';
                eContent.querySelector('#action-btn').disabled = false;
            } else {
                courseChecker.style.display = 'inline';
                eContent.querySelector('#action-btn').disabled = true;
            }
        });
    }
}

function getInputs(eContent) {
    const data = {};
    data.domain = document.querySelector('#domain').value.trim();
    data.token = document.querySelector('#token').value.trim();

    // data.courseID = eContent.querySelector('#course-id').value.trim();

    for (let input of eContent.querySelectorAll('input')) {
        if (input.type === 'checkbox') {
            data[input.id] = input.checked;
        } else {
            data[input.id] = input.value.trim();
        }
    }

    return data;
}

function errorHandler(error, progressInfo) {
    console.error(error)
    const lastIndex = error.message.lastIndexOf(':');
    let errorInfo = 'If you need assistance message Caleb and tell him to fix it.';
    const statusCode = error.message.match(/(?<=status code )[0-9]+/);
    if (statusCode) {
        switch (statusCode[0]) {
            case '401':
                errorInfo = 'Check your token';
                if (document.querySelector('#user-id')) {
                    errorInfo += ' and the User ID.';
                }
                break;
            case '403':
                errorInfo = 'Check to make sure you have permissions for the request and try again.';
                break;
            case '404':
                errorInfo = 'Check your inputs to make sure they\'re valid.';
                break;
            default:
                errorInfo = 'If you need assistance message Caleb and tell him to fix it.'
                break;
        }

    }
    progressInfo.innerHTML += `<p>There was an error: <span class="error">${error.message.slice(lastIndex + 1)}</span></p><p>${errorInfo}</p>`;
}
