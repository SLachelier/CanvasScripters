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
            assignmentCreator(e);
            break;
        case 'create-assignment-groups':
            assignmentGroupCreator(e);
            break;
        case 'delete-empty-assignment-groups':
            emptyAssignmentGroups(e);
            break;
        case 'delete-nosubmission-assignments':
            noSubmissionAssignments(e);
            break;
        case 'delete-unpublished-assignments':
            unpublishedAssignments(e);
            break;
        case 'delete-nonmodule-assignments':
            nonModuleAssignments(e);
            break;
        case 'move-assignments':
            moveAssignmentsToSingleGroup(e);
            break;
        default:
            break;
    }
}

function assignmentCreator(e) {
    let emptyGroups = [];
    hideEndpoints(e)

    const eContent = document.querySelector('#endpoint-content');
    let assignmentCreatorForm = eContent.querySelector('#assignment-creator-form');

    if (!assignmentCreatorForm) {
        // const assignmentCreatorHeader = document.createElement('div');
        // assignmentCreatorHeader.id = 'assignment-creator-header';
        // assignmentCreatorHeader.innerHTML = '<h3>Create Assignments</h3>'

        assignmentCreatorForm = document.createElement('form');
        assignmentCreatorForm.id = 'assignment-creator-form';
        assignmentCreatorForm.innerHTML = `
            <div>
                <h3>Create Assignments</h3>
            </div>
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
        eContent.append(assignmentCreatorForm);
    }
    assignmentCreatorForm.hidden = false;

    const submissionTypes = assignmentCreatorForm.querySelector('#submission-types');

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

    const createBtn = assignmentCreatorForm.querySelector('#action-btn');
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
            name: 'Assignment',
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

function noSubmissionAssignments(e) {
    hideEndpoints(e);
    console.log('renderer > noSubmissionAssignments');


    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    let noSubmissionAssignmentsForm = eContent.querySelector('#no-submission-assignments-form');

    if (!noSubmissionAssignmentsForm) {
        noSubmissionAssignmentsForm = document.createElement('form');
        noSubmissionAssignmentsForm.id = 'no-submission-assignments-form';

        // eContent.innerHTML = `
        //     <div>
        //         <h3>Delete Assignments With No Submissions</h3>
        //     </div>
        // `;

        // const eForm = document.createElement('form');

        noSubmissionAssignmentsForm.innerHTML = `
            <div>
                <h3>Delete Assignments With No Submissions</h3>
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



        eContent.append(noSubmissionAssignmentsForm);
    }
    noSubmissionAssignmentsForm.hidden = false;


    const courseID = document.querySelector('#course-id');
    checkCourseID(courseID, eContent);

    const checkBtn = noSubmissionAssignmentsForm.querySelector('#action-btn');
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

function unpublishedAssignments(e) {
    hideEndpoints(e)
    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    let deleteUnpublishedAssignmentsForm = eContent.querySelector('#delete-upublished-assignments-form');

    if (!deleteUnpublishedAssignmentsForm) {
        deleteUnpublishedAssignmentsForm = document.createElement('form');
        deleteUnpublishedAssignmentsForm.id = 'delete-upublished-assignments-form';

        // eContent.innerHTML = `
        //     <div>
        //         <h3>Delete All Unpublished Assignments</h3>
        //     </div>
        // `;

        // const eForm = document.createElement('form');

        deleteUnpublishedAssignmentsForm.innerHTML = `
            <div>
                <h3>Delete All Unpublished Assignments</h3>
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
            <div id="response-container" class="mt-3">
            </div>
        `;

        eContent.append(deleteUnpublishedAssignmentsForm);
    }
    deleteUnpublishedAssignmentsForm.hidden = false;

    const courseID = document.querySelector('#course-id');
    checkCourseID(courseID, eContent);

    const checkBtn = deleteUnpublishedAssignmentsForm.querySelector('#action-btn');
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

function nonModuleAssignments(e) {
    hideEndpoints(e)
    let assignments = [];

    const eContent = document.querySelector('#endpoint-content');
    let deleteAssignmentsNotInModulesForm = eContent.querySelector('#delete-assignments-not-in-modules-form');
    // setHeader('Delete All Assignments Not in a Module', eContent);
    // createForm('deleteNonModuleAssignments', eContent);

    if (!deleteAssignmentsNotInModulesForm) {
        deleteAssignmentsNotInModulesForm = document.createElement('form');
        deleteAssignmentsNotInModulesForm.id = 'delete-assignments-not-in-modules-form';
        // eContent.innerHTML = `
        //     <div>
        //         <h3>Delete All Assignments Not in a Module</h3>
        //     </div>
        // `;

        // const eForm = document.createElement('form');

        deleteAssignmentsNotInModulesForm.innerHTML = `
            <div>
                <h3>Delete All Assignments Not in a Module</h3>
            </div>
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

        eContent.append(deleteAssignmentsNotInModulesForm);
    }
    deleteAssignmentsNotInModulesForm.hidden = false;
    //checks for valid input in the course id field

    const courseID = eContent.querySelector('#course');
    checkCourseID(courseID, eContent);

    const checkBtn = deleteAssignmentsNotInModulesForm.querySelector('#action-btn');
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

function moveAssignmentsToSingleGroup(e) {
    hideEndpoints(e)
    console.log('renderer > moveAssignmentsToSingleGroup');

    // create form
    const eContent = document.querySelector('#endpoint-content');
    let moveAssignmentsForm = eContent.querySelector('#move-assignments');

    if (!moveAssignmentsForm) {
        moveAssignmentsForm = document.createElement('form');
        moveAssignmentsForm.id = 'move-assignments';
        // eContent.innerHTML = `
        //     <div>
        //         <h3>Move Assignments to a Single Group</h3>
        //     </div>
        // `;
        // // setHeader('Move Assignments to Single Group', eContent);
        // // createForm('moveAssignmentsToSingleGroup', eContent);

        // // find someway to generate the form

        // const eForm = document.createElement('form');
        moveAssignmentsForm.innerHTML = `
            <div>
                <h3>Move Assignments to a Single Group</h3>
            </div>
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

        eContent.append(moveAssignmentsForm);
    }
    moveAssignmentsForm.hidden = false;

    // Objectives:
    // 1. Get inputs
    // 2. Get all assignments from a course
    // 3. Get the first assignment group from the first assignment
    // 4. Loop through all assignments and move them to the first assignment group

    const courseID = document.querySelector('#course');
    checkCourseID(courseID, eContent);

    const checkBtn = moveAssignmentsForm.querySelector('#action-btn');
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