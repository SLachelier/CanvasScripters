// ****************************************
//
// Course endpoints
//
// ****************************************
function courseTemplate(e) {
    switch (e.target.id) {
        case 'reset-courses':
            resetCourses(e);
            break;
        case 'create-support-course':
            createSupportCourse(e);
            break;
        case 'create-associated-courses':
            createAssociatedCourses(e);
            break;
        default:
            break;
    }
}

async function resetCourses(e) {
    const eContent = document.querySelector('#endpoint-content');

    eContent.innerHTML = `
        <div>
            <h3>Reset Courses</h3>
        </div>
    `;

    const eForm = document.createElement('form');


    eForm.innerHTML = `
            <div class="row">
                <div class="mb-3" id="reset-switches">
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="course-reset-file">Upload file of courses to reset</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="upload-courses-switch" aria-describedby="course-reset-description">
                        <div id="course-reset-description" class="form-text" hidden>Must be a simple text file only containing a list of courses. Courses may be comma separated or on individual lines</div>
                    </div>
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="course-reset-textarea">Manually enter list of courses</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="manual-courses-reset-switch">
                    </div>
                </div>
                <div id="course-text-div" hidden>
                    <textarea class="form-control" id="reset-courses-area" rows="3" placeholder="course1,course2,course3, etc."></textarea>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="resetBtn" disabled hidden>Reset</button>
        <button type="button" class="btn btn-primary mt-3" id="uploadBtn" disabled hidden>Upload</button>
        <div id="progress-div" hidden>
            <p id="progress-info"></p>
            <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>`

    eContent.append(eForm);

    const progressDiv = eContent.querySelector('#progress-div');
    const progressBar = eContent.querySelector('.progress-bar');
    const progressInfo = eContent.querySelector('#progress-info');
    const resetBtn = eContent.querySelector('#resetBtn');
    const uploadBtn = eContent.querySelector('#uploadBtn');
    const courseTextDiv = eContent.querySelector('#course-text-div');
    const courseTextArea = eContent.querySelector('#reset-courses-area');
    courseTextArea.addEventListener('input', (e) => {
        const inputSwitch = eContent.querySelector('#manual-courses-reset-switch');
        if (courseTextArea.value.length < 1 || !inputSwitch.checked) {
            resetBtn.disabled = true;
        } else {
            resetBtn.disabled = false;
        }
    });
    const switches = eContent.querySelector('#reset-switches');
    switches.addEventListener('change', (e) => {
        const inputs = switches.querySelectorAll('input');

        // disable all inputs other than the one that's checked
        for (let input of inputs) {
            if (input.id !== e.target.id) {
                input.checked = false;
            }
        }

        // if nothing is checked disable and hide all buttons
        if (!e.target.checked) {
            for (let input of inputs) {
                input.checked = false;
            }
            resetBtn.disabled = true;
            uploadBtn.disabled = true;
        } else if (e.target.id === 'upload-courses-switch') {
            resetBtn.disabled = true;
            resetBtn.hidden = true;
            courseTextDiv.hidden = true;
            uploadBtn.disabled = false;
            uploadBtn.hidden = false;
        } else {
            resetBtn.hidden = false;
            courseTextDiv.hidden = false;
            uploadBtn.disabled = true;
            uploadBtn.hidden = true;
        }
    })

    uploadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        uploadBtn.disabled = true;
        progressInfo.innerHTML = '';
        progressDiv.hidden = false;

        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();

        let courses = [];
        try {
            courses = await window.fileUpload.resetCourse();
        } catch (error) {
            errorHandler(error, progressInfo);
        }

        if (courses.length > 0) {
            const data = {
                domain: domain,
                token: apiToken,
                courses: courses
            }

            let response;
            try {
                window.progressAPI.onUpdateProgress((progress) => {
                    progressBar.style.width = `${progress}%`;
                });

                response = await window.axios.resetCourses(data);
                if (response.successful.length > 0) {
                    progressInfo.innerHTML = `Successfully reset ${response.successful.length} course(s).`;
                }
                if (response.failed.length > 0) {
                    progressInfo.innerHTML += `Failed to reset ${response.failed.length} course(s).`;
                    progressBar.parentElement.hidden = true;
                    errorHandler({ message: `${response.failed[0].reason}` }, progressInfo); // only display the error code for the first failed request
                    // for (let failure of response.failed) {
                    // }
                }

                // for (let response of responses) {
                //     eContent.querySelector('#response-container').innerHTML += '<p>Course ID: ' + response.course_id + ' ' + response.status + '</p>';
                // }
            } catch (error) {
                errorHandler(error, progressInfo);
            } finally {
                uploadBtn.disabled = false;
            }
        }
    })

    resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();


        resetBtn.disabled = true;
        progressDiv.hidden = false;
        progressInfo.innerHTML = 'Resetting courses....';

        const domain = document.querySelector('#domain').value.trim();
        const apiToken = document.querySelector('#token').value.trim();
        const courses = eContent.querySelector('#reset-courses-area').value.split(/[\n,]/).map(course => course.trim());

        const data = {
            domain: domain,
            token: apiToken,
            courses: courses
        }

        let response;
        try {
            window.progressAPI.onUpdateProgress((progress) => {
                progressBar.style.width = `${progress}%`;
            });

            response = await window.axios.resetCourses(data);
            if (response.successful.length > 0) {
                progressInfo.innerHTML = `Successfully reset ${response.successful.length} course(s).`;
            }
            if (response.failed.length > 0) {
                progressInfo.innerHTML += `Failed to reset ${response.failed.length} course(s).`;
                progressBar.parentElement.hidden = true;
                for (let failure of response.failed) {
                    errorHandler({ message: `${failure.reason}` }, progressInfo);
                }
            }

            // for (let response of responses) {
            //     eContent.querySelector('#response-container').innerHTML += '<p>Course ID: ' + response.course_id + ' ' + response.status + '</p>';
            // }
        } catch (error) {
            errorHandler(error, progressInfo);
        } finally {
            resetBtn.disabled = false;
        }
    })

    // adding response container
    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);
}

async function createSupportCourse(e) {
    const domain = document.querySelector('#domain').value;
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
                    <div id="course-options">
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
                            <div class="col-4">
                                <label for="user-email" class="form-label">Email</label>
                                <input type="text" class="form-control" role="switch" id="user-email">
                                <div id="course-reset-description" class="form-text">NOTE: Your instructure email. Used to create emails for the new users so they can receive notifications.</div>
                            </div>
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
                            <label for="course-assignments" class="form-label"><em style="color:gray;">Add Assignments - Disabled</em></label>
                            <input type="checkbox" class="form-check-input" role="switch" id="course-assignments" disabled>
                        </div>
                        <div id="add-assignments-div" class="row hidden">
                            <div class="col-2">
                                <label for="course-add-assignments" class="form-label">How many</label>
                                <input type="text" class="form-control" role="switch" id="course-add-assignments">
                            </div>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-cq" class="form-label"><em style="color:gray;">Add Classic Quizzes - Disabled</em></label>
                            <input type="checkbox" class="form-check-input" role="switch" id="course-add-cq" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-nq" class="form-label"><em style="color:gray;">Add New Quizzes - Disabled</em></label>
                            <input type="checkbox" class="form-check-input"  role="switch" id="course-add-nq" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-discussions" class="form-label"><em style="color:gray;">Add Discussions - Disabled</em></label>
                            <input type="checkbox" class="form-check-input"  role="switch" id="course-add-discussions" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-pages" class="form-label"><em style="color:gray;">Add Pages - Disabled</em></label>
                            <input type="checkbox" class="form-check-input"  role="switch" id="course-add-pages" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-modules" class="form-label"><em style="color:gray;">Add Modules - Disabled</em></label>
                            <input type="checkbox" class="form-check-input"  role="switch" id="course-add-modules" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-add-sections" class="form-label"><em style="color:gray;">Add Sections - Disabled</em></label>
                            <input type="checkbox" class="form-check-input"  role="switch" id="course-add-sections" disabled>
                        </div>
                        <div class="col-auto form-check form-switch">
                            <label for="course-submissions" class="form-label" disabled><em style="color: gray;">Create Submissions - Disabled</em></label>
                            <input type="checkbox" class="form-check-input" role="switch" id="course-submissions" disabled>
                        </div>
                    </div>
                </div>
            </div>
        <button type="button" class="btn btn-primary mt-3" id="createBtn">Create</button>`

    eContent.append(eForm);

    const eResponse = document.createElement('div');
    eResponse.id = "response-container";
    eResponse.classList.add('mt-5');
    eContent.append(eResponse);

    const courseOptions = eContent.querySelector('#course-options');
    courseOptions.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();

        switch (e.target.id) {
            case 'course-add-users':
                courseAddUserToggle(e); // TODO
                break;
            case 'course-assignments':
                courseAssignmentsToggle(e); // TODO
                break;
            case 'course-add-cq':
                courseAddClassicToggle(e); // TODO
                break;
            case 'course-add-nq':
                courseAddNewQToggle(e); // TODO
                break;
            case 'course-add-discussions':
                courseAddDiscussionsToggle(e); // TODO
                break;
            case 'course-add-pages':
                courseAddPagesToggle(e); // TODO
                break;
            case 'course-add-modules':
                courseAddModulesToggle(e); // TODO
                break;
            case 'course-add-sections':
                courseAddSectionsToggle(e); // TODO
                break;
            case 'course-submissions':
                courseCreateSubmissionsToggle(e); // TODO
                break;
            default:
                break;
        }
    })

    function courseAddUserToggle(e) {
        const addUsersDiv = eContent.querySelector('#add-users-div');
        if (e.target.checked) {
            addUsersDiv.classList.remove('hidden');
            addUsersDiv.classList.add('visible');
        } else {
            addUsersDiv.classList.remove('visible');
            addUsersDiv.classList.add('hidden');
        }
    }

    function courseAssignmentsToggle(e) {

    }

    function courseAddClassicToggle(e) {

    }
    function courseAddNewQToggle(e) {

    }
    function courseAddDiscussionsToggle(e) {

    }
    function courseAddPagesToggle(e) {

    }
    function courseAddModulesToggle(e) {

    }
    function courseAddSectionsToggle(e) {

    }
    function courseCreateSubmissionsToggle(e) {

    }
    // const addUsersToggle = eContent.querySelector('#course-add-users');
    // addUsersToggle.addEventListener('change', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const addUsersDiv = eContent.querySelector('#add-users-div');
    //     if (e.target.checked) {
    //         addUsersDiv.classList.remove('hidden');
    //         addUsersDiv.classList.add('visible');
    //     } else {
    //         addUsersDiv.classList.remove('visible');
    //         addUsersDiv.classList.add('hidden');
    //     }
    // });

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

        const responseContainer = eContent.querySelector('#response-container');
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

        // Users to add
        const emailInput = eContent.querySelector('#user-email').value;
        const emailMatch = emailInput.match(/^[^@]+/);
        const emailPrefix = emailMatch ? emailMatch[0] : null;
        const addStudents = eContent.querySelector('#course-add-students').value;
        const addTeachers = eContent.querySelector('#course-add-teachers').value;

        const data = {
            domain: domain,
            token: apiToken,
            course_id: null,
            email: emailPrefix,
            course: {
                name: courseName,
                publish: coursePublishChbx,
                blueprint: {
                    state: courseBlueprintChbx,
                    associated_courses: null
                },
                addUsers: {
                    state: courseAddUsersChbx,
                    students: addStudents > 0 ? addStudents : null,
                    teachers: addTeachers > 0 ? addTeachers : null
                },
                addAssignments: {
                    state: courseAddAssignmentsChbx,
                    number: null
                },
                addCQ: {
                    state: courseAddCQChbx,
                    number: null
                },
                addNQ: {
                    state: courseAddNQChbx,
                    number: null
                },
                addDiscussions: {
                    state: courseAddDiscussionsChbx,
                    number: null
                },
                addPages: {
                    state: courseAddPagesChbx,
                    number: null
                },
                addModules: {
                    state: courseAddModulesChbx,
                    number: null
                },
                addSections: {
                    state: courseAddSectionsChbx,
                    number: null
                }
            }
        }

        console.log('The data is: ', data);

        try {
            const response = await window.axios.createSupportCourse(data);
            responseContainer.innerHTML = `<p>Course ID: <a id="course-link" href=${domain}/courses/${response.course_id} target="_blank">${response.course_id}`;
        } catch (error) {
            console.log('Error: ', error);
        } finally {
            createBtn.disabled = false;
        }

        const courseLink = responseContainer.querySelector('#course-link');
        courseLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('Inside courseLink click listener');
            console.log('The target is ', e.target.href);
            window.shell.openExternal(e.target.href);
        })
    })
}

async function createAssociatedCourses(e) {
    const eContent = document.querySelector('#endpoint-content');

    eContent.innerHTML = `
        <div>
            <h3>Create Associated Courses</h3>
        </div>
    `;

    const eForm = document.createElement('form');


    eForm.innerHTML = `
        <div id="ac-container">
            <div class="row flex-column">
                <div class="mb-3 col-auto">
                    <label class="form-label" for="bp-course-id">Blueprint Course ID to associated courses to</label>
                </div>
                <div class="row">
                    <div class="mb-3 col-2">
                        <input type="text" class="form-control" id="bp-course-id" aria-describedby="bp-course-text">
                    </div>
                    <div class="col-auto">
                        <span id="bp-course-text" class="form-text" hidden style="color: red;">Must be a number</span>
                    </div>
                </div>
            </div>
            <div class="row flex-column">
                <div class="mb-3 col-auto">
                    <label class="form-label" for="num-ac-courses">How many courses do you want to associate</label>
                </div>
                <div class="row">
                    <div class="mb-3 col-2">
                        <input type="text" class="form-control" id="num-ac-courses" aria-describedby="ac-course-text">
                    </div>
                    <div class="col-auto">
                        <span id="ac-course-text" class="form-text" hidden style="color: red;">Must be a number</span>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary mt-3" id="associateBtn">Associate</button>
        <div id="progress-div" hidden>
            <p id="progress-info"></p>
            <div class="progress mt-3" style="width: 75%" role="progressbar" aria-label="progress bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>`

    eContent.append(eForm);

    const associateBtn = eContent.querySelector('#associateBtn');
    const bpCourseText = eContent.querySelector('#bp-course-text');
    const acCourseText = eContent.querySelector('#ac-course-text');

    const acContainer = eContent.querySelector('#ac-container');

    const bpInput = eContent.querySelector('#bp-course-id');
    const acInput = eContent.querySelector('#num-ac-courses');

    // bpInput.addEventListener('change', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const bpValue = e.target.value;
    //     if (isNaN(bpValue)) {
    //         associateBtn.disabled = true;
    //         bpCourseText.hidden = false;
    //     } else {
    //         bpCourseText.hidden = true;
    //         associateBtn.disabled = false;
    //     }
    // });

    // acInput.addEventListener('change', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const acValue = acInput.value;
    //     const bpValue = bpInput.value;

    //     if (isNaN(acValue) || isNaN(bpValue) || acValue.length > 0 || bpValue.length > 0) {
    //         associateBtn.disabled = true;
    //         acCourseText.hidden = false;
    //     } else {
    //         acCourseText.hidden = true;
    //         associateBtn.disabled = false;
    //     }
    // });

    associateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        associateBtn.disabled = true;

        const bpValue = bpInput.value;
        const acValue = acInput.value;
        let inputError = true;
        let bpValid;
        let acValid;

        bpValid = validateInput(bpValue, bpCourseText);
        acValid = validateInput(acValue, acCourseText);

        if (bpValid && acValid) {
            const domain = document.querySelector('#domain').value;
            const token = document.querySelector('#token').value;
            const progressDiv = eContent.querySelector('#progress-div');
            const progressInfo = eContent.querySelector('#progress-info');
            const progressBar = eContent.querySelector('.progress-bar');

            const data = {
                domain: domain,
                token: token,
                bpCourseID: parseInt(bpValue),
                acCourseNum: parseInt(acValue)
            }

            // check to make sure the BP course is a BP course
            let isBluePrint = false;
            try {
                const request = await window.axios.getCourseInfo(data);
                isBluePrint = request.blueprint;
            } catch (error) {
                errorHandler(error, progressInfo);
            }

            if (isBluePrint) {
                // create the courses to be added as associated courses
                try {
                    const courseResponse = await window.axios.createBasicCourse(data);
                    const associatedCourses = courseResponse.successful.map(course => course.value.id);

                    // adding the ids of the courses to be associated to the data set
                    data.associated_course_ids = associatedCourses;

                    const associate = await window.axios.associateCourses(data);
                    if (associate.workflow_state === 'queued') {
                        progressInfo.innerHTML = `Finished associating ${acValue} courses to the Blueprint, sync has started.`;
                    }
                    console.log('Finished associating courses.');

                    // const acResponse = await window.axios.addAssociateCourse(data);
                } catch (error) {
                    errorHandler(error, progressInfo);
                } finally {
                    associateBtn.disabled = false;
                }
            } else {
                progressInfo.innerHTML = 'BluePrint course isn\'t setup as blueprint. Unable to associate courses.';
                associateBtn.disabled = false;
            }
        } else {
            associateBtn.disabled = false;
        }
    });
}