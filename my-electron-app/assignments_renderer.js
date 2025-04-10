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
        case 'delete-nosubmission-assignments':
            noSubmissionAssignments(e);
            break;
        case 'delete-unpublished-assignments':
            unpublishedAssignments(e);
            break;
        case 'delete-nonmodule-assignments':
            nonModuleAssignments(e);
            break;
        case 'delete-old-assignments':
            deleteOldAssignments(e);
            break;
        case 'delete-assignments-from-import':
            deleteAssignmentsFromImport(e);
            break;
        case 'move-assignments':
            moveAssignmentsToSingleGroup(e);
            break;
        case 'delete-assignments-from-group':
            deleteAssignmentsInGroup(e);
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
            <div hidden id="assignment-creator-progress-div">
                <p id="assignment-creator-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">

                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="assignment-creator-response-container" class="mt-3">
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
    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, eContent);
    })

    const assignmentCreateBtn = assignmentCreatorForm.querySelector('#action-btn');
    assignmentCreateBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        assignmentCreateBtn.disabled = true;

        // get values and inputs
        const assigmentCreatorResponseContainer = assignmentCreatorForm.querySelector('#assignment-creator-response-container');
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

        const assignmentCreatorProgressDiv = document.querySelector('#assignment-creator-progress-div');
        const assignmentCreatorProgressBar = assignmentCreatorProgressDiv.querySelector('.progress-bar');
        const assignmentCreatorProgressInfo = document.querySelector('#assignment-creator-progress-info');

        // clean environment
        assignmentCreatorProgressDiv.hidden = false;
        assignmentCreatorProgressBar.style.width = '0%';
        assignmentCreatorProgressInfo.innerHTML = '';

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
            assignmentCreatorProgressBar.style.width = `${progress}%`;
        });

        try {
            const createAssignmentResponse = await window.axios.createAssignments(requestData);
            if (createAssignmentResponse.successful.length > 0) {
                assignmentCreatorProgressInfo.innerHTML = `Successfully created ${createAssignmentResponse.successful.length} assignments.`;
            }
            if (createAssignmentResponse.failed.length > 0) {
                assignmentCreatorProgressInfo.innerHTML += `Failed to create ${createAssignmentResponse.failed.length} assignments.`;
                assignmentCreatorProgressBar.parentElement.hidden = true;
                errorHandler({ message: `${createAssignmentResponse.failed[0].reason}` }, assignmentCreatorProgressInfo);
                // for (let failure of createAssignmentResponse.failed) {
                //     errorHandler({ message: `${failure.reason}` }, progressInfo);
                // }
                // <span class='error'>${createAssignmentResponse.failed[0].reason}.</span>;
            }
        } catch (error) {
            assignmentCreatorProgressBar.parentElement.hidden = true;
            errorHandler(error, assignmentCreatorProgressInfo);
        } finally {
            assignmentCreateBtn.disabled = false;
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
            <div hidden id="nsa-progress-div">
                <p id="nsa-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="nsa-response-container" class="mt-5">
            </div>
        `;



        eContent.append(noSubmissionAssignmentsForm);
    }
    noSubmissionAssignmentsForm.hidden = false;


    const courseID = document.querySelector('#course-id');
    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, eContent);
    })

    const checkBtn = noSubmissionAssignmentsForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        const gradedSubmissions = noSubmissionAssignmentsForm.querySelector('#graded-submissions').checked;
        console.log(gradedSubmissions);

        checkBtn.disabled = true;
        console.log('renderer > noSubmissionAssignments > check');

        const nsaResponseContainer = document.querySelector('#nsa-response-container');
        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const course_id = courseID.value.trim();
        const nsaProgressDiv = document.querySelector('#nsa-progress-div');
        const nsaProgressBar = nsaProgressDiv.querySelector('.progress-bar');
        const nsaProgressInfo = document.querySelector('#nsa-progress-info');


        // clean environment
        nsaResponseContainer.innerHTML = '';
        nsaProgressDiv.hidden = false;
        nsaProgressBar.parentElement.hidden = true;
        nsaProgressBar.style.width = '0%';
        nsaProgressInfo.innerHTML = 'Checking...';


        const requestData = {
            domain,
            token,
            course_id,
            graded: gradedSubmissions
        }

        let hasError = false;
        try {
            assignments = await window.axios.getNoSubmissionAssignments(requestData);
            nsaProgressInfo.innerHTML = 'Done';
        }
        catch (error) {
            errorHandler(error, nsaProgressInfo)
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }

        if (!hasError) {
            console.log(`found ${assignments.length} assignments with no submissions`);


            //const eContent = document.querySelector('#endpoint-content');
            let gradedText = gradedSubmissions ? 'no submissions.' : 'no submissions or grades.';
            nsaResponseContainer.innerHTML = `
                        <div>
                            <div class="row align-items-center">
                                <div id="nsa-response-details" class="col-auto">
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

            const nsaResponseDetails = nsaResponseContainer.querySelector('#nsa-response-details');

            const cancelBtn = document.querySelector('#cancel-btn');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                nsaResponseContainer.innerHTML = '';
                checkBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const removeBtn = document.querySelector('#remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('renderer > getNoSubmissionAssignments > removeBtn');

                nsaResponseDetails.innerHTML = ``;
                nsaProgressBar.parentElement.hidden = false;
                nsaProgressInfo.innerHTML = `Removing ${assignments.length} assignments...`;

                const assignmentIDs = assignments.map((assignment) => {
                    return {
                        name: assignment.name,
                        id: assignment.id
                    };
                });

                const messageData = {
                    domain,
                    token,
                    course_id,
                    number: assignmentIDs.length,
                    assignments: assignmentIDs
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    nsaProgressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteNoSubmissionASsignments = await window.axios.deleteAssignments(messageData);

                    if (deleteNoSubmissionASsignments.successful.length > 0) {
                        nsaProgressInfo.innerHTML = `Successfully removed ${deleteNoSubmissionASsignments.successful.length} assignments.`;
                    }
                    if (deleteNoSubmissionASsignments.failed.length > 0) {
                        nsaProgressInfo.innerHTML = `Failed to remove ${deleteNoSubmissionASsignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, nsaProgressInfo)
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
            <div hidden id="dua-progress-div">
                <p id="dua-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="dua-response-container" class="mt-3">
            </div>
        `;

        eContent.append(deleteUnpublishedAssignmentsForm);
    }
    deleteUnpublishedAssignmentsForm.hidden = false;

    const courseID = document.querySelector('#course-id');
    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, eContent);
    });

    const checkBtn = deleteUnpublishedAssignmentsForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const duaResponseContainer = document.queryselector('#dua-response-container');
        const duaProgressDiv = document.querySelector('#dua-progress-div');
        const duaProgressBar = duaProgressDiv.querySelector('.progress-bar');
        const duaProgressInfo = document.querySelector('#dua-progress-info');

        // clean environment
        duaProgressDiv.hidden = false;
        duaProgressBar.style.width = '0%';
        duaProgressBar.parentElement.hidden = true;
        duaProgressInfo.innerHTML = "Checking...";

        const requestData = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let hasError = false;
        try {
            assignments = await window.axios.getUnpublishedAssignments(requestData);
            duaProgressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, duaProgressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }


        if (!hasError) {
            console.log('found assignments', assignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            duaResponseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="dua-response-details" class="col-auto">
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

            const duaResponseDetails = responseContainer.querySelector('#dua-response-details');

            const cancelBtn = document.querySelector('#cancel-btn');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                duaResponseContainer.innerHTML = '';
                checkBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const removeBtn = document.querySelector('#remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside remove');

                // responseDetails.innerHTML = `Removing ${assignments.length} assignments...`;
                duaResponseDetails.innerHTML = ``;
                dueProgressInfo.innerHTML = `Deleting ${assignments.length} assignments...`;
                duaProgressBar.style.width = '0%';
                duaProgressBar.parentElement.hidden = false;


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
                    duaProgressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteUnpublishedAssignments = await window.axios.deleteAssignments(messageData);
                    if (deleteUnpublishedAssignments.successful.length > 0) {
                        duaProgressInfo.innerHTML = `Successfully removed ${deleteUnpublishedAssignments.successful.length} assignments.`;
                    }
                    if (deleteUnpublishedAssignments.failed.length > 0) {
                        duaProgressInfo.innerHTML = `Failed to remove ${deleteUnpublishedAssignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, duaProgressInfo);
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
            <div hidden id="danim-progress-div">
                <p id="danim-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="danim-response-container" class="mt-5">
            </div>
        `;

        eContent.append(deleteAssignmentsNotInModulesForm);
    }
    deleteAssignmentsNotInModulesForm.hidden = false;
    //checks for valid input in the course id field

    const courseID = eContent.querySelector('#course');
    courseID.addEventListener('change', (e) => {
        e.stopPropagation();
        e.preventDefault();

        checkCourseID(courseID, eContent);

    })

    const checkBtn = deleteAssignmentsNotInModulesForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const danimResponseContainer = document.queryselector('#danim-response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const danimProgressDiv = document.querySelector('#danim-progress-div');
        const danimProgressBar = danimProgressDiv.querySelector('.progress-bar');
        const danimProgressInfo = document.querySelector('#danim-progress-info');

        // clean environment
        danimProgressDiv.hidden = false;
        danimProgressBar.parentElement.hidden = true;
        danimProgressBar.style.width = '0%';
        danimProgressInfo.innerHTML = "Checking...";

        const requestData = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let hasError = false;
        try {
            assignments = await window.axios.getNonModuleAssignments(requestData);
            danimProgressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, danimProgressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;
        }

        if (!hasError) {
            console.log('found assignments', assignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            danimResponseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="danim-response-details" class="col-auto">
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
                danimResponseContainer.innerHTML = '';
                checkBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const removeBtn = document.querySelector('#remove-btn');
            removeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside remove');

                const danimResponseDetails = responseContainer.querySelector('#danim-response-details');
                danimResponseDetails.innerHTML = ``;

                danimProgressBar.parentElement.hidden = false;
                danimProgressInfo.innerHTML = `Removing ${assignments.length} assignments...`;

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
                    danimProgressBar.style.width = `${progress}%`;
                });

                try {
                    const deleteNonModuleAssignments = await window.axios.deleteAssignments(messageData);
                    if (deleteNonModuleAssignments.successful.length > 0) {
                        danimProgressInfo.innerHTML = `Successfully removed ${deleteNonModuleAssignments.successful.length} assignments.`;
                    }
                    if (deleteNonModuleAssignments.failed.length > 0) {
                        danimProgressInfo.innerHTML = `Failed to remove ${deleteNonModuleAssignments.failed.length} assignments.`;
                    }
                } catch (error) {
                    errorHandler(error, danimProgressInfo);
                } finally {
                    checkBtn.disabled = false;
                }
            });
        }
    })
}

function deleteOldAssignments(e) {
    hideEndpoints(e)
    console.log('renderer > deleteOldAssignments');

    const eContent = document.querySelector('#endpoint-content');
    let deleteOldAssignmentsForm = eContent.querySelector('#delete-old-assignments-form');

    if (!deleteOldAssignmentsForm) {
        deleteOldAssignmentsForm = document.createElement('form');
        deleteOldAssignmentsForm.id = 'create-module-delete-form';
        deleteOldAssignmentsForm.innerHTML = `
            <div>
                <h3>Delete Old Assignments</h3>
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
                <div class="col-auto mt-3" >
                    <label class="form-label">Delete assignments with a due date on or before this date</label>
                </di>
                <div class="col-4">
                    <input class="form-control" id="due-date-input" type="date">
                </div>
                <div class="col-auto">
                    <button id="check-old-assignments-btn" class="btn btn-primary mt-3" disabled>Check</button>
                </div>
            </div>
            <div hidden id="doa-progress-div">
                <p id="doa-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="doa-response-container" class="mt-3">
            </div>
        `;

        eContent.append(deleteOldAssignmentsForm);
    }
    deleteOldAssignmentsForm.hidden = false;

    const courseID = deleteOldAssignmentsForm.querySelector('#course-id');
    const dueDate = deleteOldAssignmentsForm.querySelector('#due-date-input');

    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, deleteOldAssignmentsForm);
    });

    const deleteOldAssignmentsBtn = deleteOldAssignmentsForm.querySelector('button');
    deleteOldAssignmentsBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteOldAssignmentsBtn.disabled = true;

        const doaResponseContainer = document.queryselector('#doa-response-container');
        const doaProgressDiv = document.querySelector('#doa-progress-div');
        const doaProgressBar = doaProgressDiv.querySelector('.progress-bar');
        const doaProgressInfo = document.querySelector('#doa-progress-info');

        if (dueDate.value !== '') {

            const domain = document.querySelector('#domain').value.trim();
            const token = document.querySelector('#token').value.trim();
            const course_id = courseID.value.trim();
            const due_Date = deleteOldAssignmentsForm.querySelector('#due-date-input').value;

            // clean environment
            doaResponseContainer.innerHTML = '';
            doaProgressDiv.hidden = false;
            doaProgressBar.parentElement.hidden = true;
            doaProgressBar.style.width = '0%';
            doaProgressInfo.innerHTML = 'Checking...';

            const requestData = {
                domain,
                token,
                course_id,
                due_Date
            };
            console.log('The data is ', requestData);

            let assignments = [];
            let hasError = false;

            try {
                assignments = await window.axios.getOldAssignments(requestData);
            } catch (error) {
                hasError = true;
                errorHandler(error, doaProgressInfo);
            } finally {
                deleteOldAssignmentsBtn.disabled = false;
            }

            if (!hasError) {
                doaProgressInfo.innerHTML = '';
                if (assignments.length < 1) {
                    doaResponseContainer.innerHTML = `
                        <div>
                            <div class="row align-items-center">
                                <div id="doa-response-details" class="col-auto">
                                    <span>Didn't find any assignments due at or before the current selected date.</span>
                                </div>
                            </div>
                        </div>`
                } else {
                    console.log('found old assignments', assignments.length);

                    //const eContent = document.querySelector('#endpoint-content');
                    doaResponseContainer.innerHTML = `
                    <div>
                        <div class="row align-items-center">
                            <div id="doa-response-details" class="col-auto">
                                <span>Found ${assignments.length} old assignments.</span>
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

                    const doaResponseDetails = responseContainer.querySelector('#doa-response-details');

                    const cancelBtn = document.querySelector('#cancel-btn');
                    cancelBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        courseID.value = '';
                        doaResponseContainer.innerHTML = '';
                        deleteOldAssignmentsBtn.disabled = false;
                        //clearData(courseID, responseContent);
                    });

                    const removeBtn = document.querySelector('#remove-btn');
                    removeBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        console.log('inside remove');

                        // responseDetails.innerHTML = `Removing ${assignments.length} assignments...`;
                        doaResponseDetails.innerHTML = ``;
                        doaProgressInfo.innerHTML = `Deleting ${assignments.length} assignments...`;
                        doaProgressBar.style.width = '0%';
                        doaProgressBar.parentElement.hidden = false;


                        // remapping to only include the id from the graphql response
                        const assignmentIDs = assignments.map((assignment) => {
                            return {
                                id: assignment._id
                            };
                        });

                        const messageData = {
                            domain,
                            token,
                            course_id,
                            number: assignmentIDs.length,
                            assignments: assignmentIDs
                        }

                        // const successful = [];
                        // const failed = [];


                        window.progressAPI.onUpdateProgress((progress) => {
                            doaProgressBar.style.width = `${progress}%`;
                        });

                        try {
                            const deleteOldAssignments = await window.axios.deleteAssignments(messageData);
                            if (deleteOldAssignments.successful.length > 0) {
                                doaProgressInfo.innerHTML = `Successfully removed ${deleteOldAssignments.successful.length} assignments.`;
                            }
                            if (deleteOldAssignments.failed.length > 0) {
                                doaProgressInfo.innerHTML = `Failed to remove ${deleteOldAssignments.failed.length} assignments.`;
                            }
                        } catch (error) {
                            errorHandler(error, doaProgressInfo);
                        } finally {
                            deleteOldAssignmentsBtn.disabled = false;
                        }
                    })
                }
            }
        } else {
            doaResponseContainer.innerHTML = '';
            doaProgressDiv.hidden = false;
            doaProgressBar.parentElement.hidden = true;
            doaProgressBar.style.width = '0%';
            doaProgressInfo.innerHTML = '<span style="color: red;">Enter a valid due date</span>';

            deleteOldAssignmentsBtn.disabled = false;
        }

    });
}

function deleteAssignmentsFromImport(e) {
    hideEndpoints(e)
    console.log('renderer > deleteAssignmentsFromImport');

    const eContent = document.querySelector('#endpoint-content');
    let deleteAssignmentsFromImportForm = eContent.querySelector('#dafi-form');

    if (!deleteAssignmentsFromImportForm) {
        deleteAssignmentsFromImportForm = document.createElement('form');
        deleteAssignmentsFromImportForm.id = 'dafi-form';
        deleteAssignmentsFromImportForm.innerHTML = `
            <div>
                <h3>Delete Assignments Created From Import</h3>
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
                <div class="col-auto mt-3" >
                    <label class="form-label">Import ID</label>
                </di>
                <div class="col-4">
                    <input class="form-control" id="import-id" type="text">
                </div>
                <div class="col-auto">
                    <button id="check-import-assignments-btn" class="btn btn-primary mt-3" disabled>Check</button>
                </div>
            </div>
            <div hidden id="dafi-progress-div">
                <p id="dafi-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="dafi-response-container" class="mt-3">
            </div>
        `;

        eContent.append(deleteAssignmentsFromImportForm);
    }
    deleteAssignmentsFromImportForm.hidden = false;

    const courseID = deleteAssignmentsFromImportForm.querySelector('#course-id');
    const importID = deleteAssignmentsFromImportForm.querySelector('#import-id');

    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, deleteAssignmentsFromImportForm);
    });

    const dafiCheckBtn = deleteAssignmentsFromImportForm.querySelector('button');
    dafiCheckBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        dafiCheckBtn.disabled = true;

        // getting the elements
        const dafiResponseContainer = deleteAssignmentsFromImportForm.querySelector('#dafi-response-container');
        const dafiProgressDiv = deleteAssignmentsFromImportForm.querySelector('#dafi-progress-div');
        const dafiProgressBar = dafiProgressDiv.querySelector('.progress-bar');
        const dafiProgressInfo = deleteAssignmentsFromImportForm.querySelector('#dafi-progress-info');

        // clearing values
        dafiResponseContainer.innerHTML = '';
        dafiProgressBar.parentElement.hidden = true;
        dafiProgressBar.style.width = '0%';
        dafiProgressInfo.innerHTML = '';
        dafiProgressDiv.hidden = false;

        // getting the values
        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const course_id = courseID.value;
        const import_id = importID.value;

        // creating request object
        const requestData = {
            domain,
            token,
            course_id,
            import_id
        }

        dafiProgressInfo.innerHTML = `Checking for imported assignments from the import ${import_id}...`;

        let importedAssignments = [];
        let hasError = false;
        try {
            importedAssignments = await window.axios.getImportedAssignments(requestData);
            dafiProgressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, dafiProgressInfo);
            hasError = true;
        } finally {
            dafiCheckBtn.disabled = false;
        }

        if (!hasError) {
            console.log('found assignments', importedAssignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            dafiResponseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="dafi-response-details" class="col-auto">
                            <span>Found ${importedAssignments.length} assignments in the import.</span>
                        </div>

                        <div class="w-100"></div>

                        <div class="col-2">
                            <button id="dafi-remove-btn" type="button" class="btn btn-danger">Remove</button>
                        </div>
                        <div class="col-2">
                            <button id="dafi-cancel-btn" type="button" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>    
            `;

            const dafiResponseDetails = dafiResponseContainer.querySelector('#dafi-response-details');

            const dafiCancelBtn = document.querySelector('#dafi-cancel-btn');
            dafiCancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                dafiResponseContainer.innerHTML = '';
                dafiCancelBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const dafiRemoveBtn = document.querySelector('#dafi-remove-btn');
            dafiRemoveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside remove');
                dafiRemoveBtn.disabled = true;
                dafiCancelBtn.disabled = true;

                dafiResponseDetails.innerHTML = '';
                dafiProgressBar.parentElement.hidden = false;
                dafiProgressInfo.innerHTML = `Removing ${assignments.length} assignments...`;

                // const messageData = {
                //     url: `https://${domain}/api/v1/courses/${courseID}/assignments`,
                //     token: apiToken,
                //     content: assignments
                // }

                const messageData = {
                    domain,
                    course_id,
                    token,
                    number: importedAssignments.length,
                    assignments: importedAssignments
                }

                window.progressAPI.onUpdateProgress((progress) => {
                    dafiProgressBar.style.width = `${progress}%`;
                });

                try {
                    const response = await window.axios.deleteAssignments(messageData);

                    if (response.successful.length > 0) {
                        dafiProgressInfo.innerHTML = `<p>Successfully removed ${response.successful.length} assignments.</p>`;
                    }
                    if (response.failed.length > 0) {
                        dafiProgressInfo.innerHTML += `<p>Failed to remove ${response.failed.length} assignments.</p>`;
                    }
                    dafiCheckBtn.disabled = false;
                } catch (error) {
                    errorHandler(error, dafiProgressInfo)
                } finally {
                    dafiCheckBtn.disabled = false;
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
            <div hidden id="mag-progress-div">
                <p id="mag-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="mag-response-container" class="mt-5">
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
    courseID.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        checkCourseID(courseID, eContent);
    });

    const checkBtn = moveAssignmentsForm.querySelector('#action-btn');
    checkBtn.addEventListener('click', async function (e) {
        e.stopPropagation();
        e.preventDefault();

        checkBtn.disabled = true;
        console.log('Inside renderer check');

        const magResponseContainer = document.queryselector('#mag-response-container');
        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const magProgressDiv = document.querySelector('#mag-progress-div');
        const magProgressBar = magProgressDiv.querySelector('.progress-bar');
        const magProgressInfo = document.querySelector('#mag-progress-info');

        // clean environment
        magProgressDiv.hidden = false;
        magProgressBar.parentElement.hidden = true;
        magProgressBar.style.width = '0%';
        magProgressInfo.innerHTML = "Checking...";

        const data = {
            domain: domain,
            token: apiToken,
            course: courseID.value.trim()
        }

        let assignments = [];
        let hasError = false;
        try {
            assignments = await window.axios.getAssignmentsToMove(data);
            magProgressInfo.innerHTML = 'Done';
        } catch (error) {
            errorHandler(error, magProgressInfo);
            hasError = true;
        } finally {
            checkBtn.disabled = false;

        }

        if (!hasError) {
            let assignmentGroup = assignments[0].assignmentGroupId;

            console.log('found assignments', assignments.length);

            //const eContent = document.querySelector('#endpoint-content');
            magResponseContainer.innerHTML = `
                <div>
                    <div class="row align-items-center">
                        <div id="mag-response-details" class="col-auto">
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

            const magResponseDetails = magResponseContainer.querySelector('#mag-response-details');

            const cancelBtn = document.querySelector('#cancel-btn');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                courseID.value = '';
                magResponseContainer.innerHTML = '';
                checkBtn.disabled = false;
                //clearData(courseID, responseContent);
            });

            const moveBtn = document.querySelector('#move-btn');
            moveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('inside move');

                magResponseDetails.innerHTML = '';
                magProgressBar.parentElement.hidden = false;
                magProgressInfo.innerHTML = `Moving ${assignments.length} assignments...`;

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
                    magProgressBar.style.width = `${progress}%`;
                });

                try {
                    const moveAssignmentsToSingleGroup = await window.axios.moveAssignmentsToSingleGroup(messageData);

                    if (moveAssignmentsToSingleGroup.successful.length > 0) {
                        magProgressInfo.innerHTML = `Successfully removed ${moveAssignmentsToSingleGroup.successful.length} assignments.`;
                    }
                    if (moveAssignmentsToSingleGroup.failed.length > 0) {
                        magProgressInfo.innerHTML = `Failed to remove ${moveAssignmentsToSingleGroup.failed.length} assignments.`;
                    }
                    checkBtn.disabled = false;
                } catch (error) {
                    errorHandler(error, magProgressInfo)
                } finally {
                    checkBtn.disabled = false;
                }
            });
        }
    });
}

function deleteAssignmentsInGroup(e) {
    hideEndpoints(e)
    console.log('renderer > deleteAssignmentsInGroup');

    // create form
    const eContent = document.querySelector('#endpoint-content');
    let deleteAssignmentsInGroupForm = eContent.querySelector('#delete-assignments-in-group');

    if (!deleteAssignmentsInGroupForm) {
        deleteAssignmentsInGroupForm = document.createElement('form');
        deleteAssignmentsInGroupForm.id = 'delete-assignments-in-group';
        // eContent.innerHTML = `
        //     <div>
        //         <h3>Move Assignments to a Single Group</h3>
        //     </div>
        // `;
        // // setHeader('Move Assignments to Single Group', eContent);
        // // createForm('moveAssignmentsToSingleGroup', eContent);

        // // find someway to generate the form

        // const eForm = document.createElement('form');
        deleteAssignmentsInGroupForm.innerHTML = `
            <div>
                <h3>Delete Assignments in a Single Group</h3>
            </div>
            <div class="row align-items-center">
                <div class="col-auto">
                    <label class="form-label">Course</label>
                </div>
                <div class="w-100"></div>
                <div class="col-2">
                    <input id="course-id" type="text" class="form-control" aria-describedby="course-checker" />
                </div>
                <div class="col-auto" >
                    <span id="course-checker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
            </div>
            <div class="row align-item-center">
                <div class="col-auto">
                    <label class="form-label">Group ID</label>
                </div>
                <div class="w-100"></div>
                <div class="col-2">
                    <input id="group-id" type="text" class="form-control" aria-describedby="group-checker" />
                </div>
                <div class="col-auto" >
                    <span id="group-checker" class="form-text" style="display: none;">Must only contain numbers</span>
                </div>
                <div class="w-100"></div>
            </div>
                <div class="col-auto">
                    <button id="daig-btn" class="btn btn-primary mt-3" disabled>Check</button>
                </div>
            <div hidden id="daig-progress-div">
                <p id="daig-progress-info"></p>
                <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div id="daig-response-container" class="mt-5">
            </div>
        `;

        eContent.append(deleteAssignmentsInGroupForm);
    }
    deleteAssignmentsInGroupForm.hidden = false;

    // Objectives:
    // 1. Get inputs
    // 2. Try to delete group and all assignments in it
    // 3. If 2 fails get all assignments in the group
    // 4. Delete all those assignments
    // 5. Delete group

    // check course ID is a number
    // const courseID = deleteAssignmentsInGroupForm.querySelector('#course');
    // courseID.addEventListener('change', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     checkCourseID(courseID, eContent);
    // });

    // // check group ID is a number and exists
    // const groupID = deleteAssignmentsInGroupForm.querySelector('#group-id');
    // groupID.addEventListener('change', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const groupChecker = deleteAssignmentsInGroupForm.querySelector(`#group-checker`);
    //     const trimmedValue = groupID.value.trim();
    //     if (trimmedValue === '') {
    //         groupChecker.style.display = 'none';
    //         deleteAssignmentsInGroupForm.querySelector('button').disabled = true;
    //     } else if (!isNaN(Number(trimmedValue))) {
    //         groupChecker.style.display = 'none';
    //         deleteAssignmentsInGroupForm.querySelector('button').disabled = false;
    //     } else {
    //         groupChecker.style.display = 'inline';
    //         deleteAssignmentsInGroupForm.querySelector('button').disabled = true;
    //     }
    // });

    //checking valid input
    deleteAssignmentsInGroupForm.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const daigCheckBtn = deleteAssignmentsInGroupForm.querySelector('#daig-btn');
        const courseChecker = deleteAssignmentsInGroupForm.querySelector('#course-checker')
        const courseID = deleteAssignmentsInGroupForm.querySelector('#course-id')
        const groupChecker = deleteAssignmentsInGroupForm.querySelector('#group-checker')
        const groupID = deleteAssignmentsInGroupForm.querySelector('#group-id')
        const input = e.target.value;

        console.log(e.target);

        if (courseID.value.trim() !== '' && groupID.value.trim() !== '') {
            if (isNaN(Number(input))) {
                if (e.target.id === 'group-id') {
                    groupChecker.style.display = 'inline';
                } else {
                    courseChecker.style.display = 'inline';
                }
                // daigCheckBtn.disabled = true;
            } else {
                if (e.target.id === 'group-id') {
                    groupChecker.style.display = 'none';
                } else {
                    courseChecker.style.display = 'none';
                }
            }

            if (groupChecker.style.display === 'inline' || courseChecker.style.display === 'inline') {
                daigCheckBtn.disabled = true;
            } else {
                daigCheckBtn.disabled = false;
            }
        } else {
            daigCheckBtn.disabled = true;
        }
    })

    const daigCheckBtn = deleteAssignmentsInGroupForm.querySelector('#daig-btn');
    daigCheckBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        daigCheckBtn.disabled = true;

        // get domain, token, course, and group ID info
        const domain = document.querySelector('#domain').value.trim();
        const token = document.querySelector('#token').value.trim();
        const course_id = deleteAssignmentsInGroupForm.querySelector('#course-id').value.trim();
        const group_id = deleteAssignmentsInGroupForm.querySelector('#group-id').value.trim();

        const requestData = {
            domain,
            token,
            course_id,
            group_id
        }

        const deleteAssignmentGroupAssignments = await window.axios.deleteAssignmentGroupAssignments(requestData);
        console.log(deleteAssignmentGroupAssignments);
    })
}