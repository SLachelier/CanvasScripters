// assignments.js
// ---------------
// createAssignments(course,number)
// ------------------------------
// getAssignments(course)
// -------------------------------
// deleteNoSubmissionAssignments(course)
// ----------------------------------

// const config = require('./config.js');
const pagination = require('./pagination.js');
const csvExporter = require('./csvExporter');
const axios = require('axios');
const { deleteRequester } = require('./utilities.js');
// const questionAsker = require('../questionAsker');
// const readline = require('readline');

//const qAsker = questionAsker.questionDetails;
// const axios = config.instance;

async function createAssignments(course, number) {

    console.log(`Creating ${number} assignment(s)`);
    let url = `courses/${course}/assignments`;
    const data = {
        assignment: {
            name: 'Assignment 1',
            submission_types: [
                'online_upload',
            ],
            allowed_extensions: [
            ],
            points_possible: 10,
            grading_type: 'points',
            post_to_sis: false,
            due_at: null,
            lock_at: null,
            unlock_at: null,
            description: 'This is the assignment description',
            published: false,
            anonymous_grading: false,
            allowed_attempts: -1,
        }
    }

    try {
        let counter = 0;
        let startTime = performance.now();
        for (let num = 1; num <= number; num++) {
            data.assignment.name = `Assignment ${num}`;
            const response = await axios.post(url, data);
            counter++;
        }
        let endTime = performance.now();
        console.log(`Created ${counter} assignment(s) in ${Math.floor(endTime - startTime) / 1000} seconds`)
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('A different error', error.message);
        }
    }
}

async function getAssignments(domain, courseID, token) {
    console.log('Getting assignment(s)');

    let assignmentList = [];
    let myURL = `https://${domain}/api/v1/courses/${courseID}/assignments?per_page=100`;

    while (myURL) {
        console.log('inside while', myURL);
        try {
            const response = await axios.get(myURL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.headers.get('link')) {
                myURL = pagination.getNextPage(response.headers.get('link'));
            } else {
                myURL = false;
            }

            for (let assignment of response.data) {
                assignmentList.push(assignment);
            }
        } catch (error) {
            console.log('there was an error');
            if (error.response) {
                console.log('error with response');
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log('error with request');
                console.log(error.request);
            } else {
                console.log('A different error', error.message);
            }
            return false;
        }
    }

    return assignmentList;
}

async function getNoSubmissionAssignments(domain, courseID, token, graded) {

    const assignments = await getAssignments(domain, courseID, token);

    const noSubmissionAssignments = assignments.filter(assignment => {
        if (graded) {
            if (!assignment.has_submitted_submissions) {
                return assignment;
            }
        } else {
            if (!assignment.graded_submissions_exist) {
                return assignment;
            }
        }
    });

    return noSubmissionAssignments;
}

async function deleteNoSubmissionAssignments(domain, course, token, assignments) {
    console.log('Deleting assignments with no submissions');
    const baseURL = `https://${domain}/api/v1/courses/${course}/assignments`;

    return await deleteRequester(assignments, baseURL, null, token);

    // let myURL = `https://courses/${courseID}/assignments/`;
    // let assignments = [];

    // try {
    //     // getting all assignments to filter later
    //     assignments = await getAssignments(courseID);
    // } catch (error) {
    //     console.log('This is the error', error)
    // }

    // filtering only unsubmitted assignments
    // const noSubmissionAssignments = assignments.filter(assignment => {
    //     if (!assignment.has_submitted_submissions) {
    //         return assignment;
    //     }
    // });
    // if (noSubmissionAssignments.length === 0) {
    //     console.log('No assignments to delete');
    //     return;
    // }
    // // ------------------------------------
    // // Figure out how to prompt user if they're sure
    // // ------------------------------------

    // const answer = await questionAsker.questionDetails(`Found ${noSubmissionAssignments.length} assignments with no submissions. \nAre you sure you want to delete them?`);
    // questionAsker.close();
    // if (answer === 'no') {
    //     return;
    // }

    // csvExporter.exportToCSV(noSubmissionAssignments, 'No_Submissions');

    // console.log('Total assignments', assignments.length);
    // console.log('Total with no submissions', noSubmissionAssignments.length);


    // console.log('Deleting assignments with no submissions');
    // const startTime = performance.now();
    // let deleteCounter = 0;

    // //***********************************************
    // // Make this better using promise.all()
    // //***********************************************
    // for (let assignment of noSubmissionAssignments) {
    //     try {
    //         console.log('deleting ', assignment.id);
    //         await axios.delete(myURL + assignment.id);
    //     } catch (error) {
    //         console.log('The Error deleting the assignment is ', error);
    //     }
    //     deleteCounter++;
    // }
    // const endTime = performance.now();
    // console.log(`Deleted ${deleteCounter} assignment(s) in ${Math.floor(endTime - startTime) / 1000} seconds`);
}

async function deleteAllAssignments(courseID, assignments) {
    //let assignments = await getAssignments(courseID);
    for (const assignment of assignments) {
        //console.log('assignment id ', assignment._id);
        let url = `https://mc3.instructure.com/api/v1/courses/5909/assignments/${assignment._id}`;
        //console.log(url);
        try {
            const response = await axios.delete(url);
        } catch (error) {
            console.log('There was an error', error.message);
        }
    }
}


// the function that does the stuff
// (async () => {
//     const curDomain = await questionAsker.questionDetails('What domain: ');
//     const courseID = await questionAsker.questionDetails('What course: ');
//     //const number = await questionAsker.questionDetails('How many assignments do you want to create: ');


//     axios.defaults.baseURL = `https://${curDomain}/api/v1/`;
//     //const myAssignments = await getAssignments(courseID);

//     await deleteNoSubmissionAssignments(courseID);
//     questionAsker.close();

//     //     // // ***************************************************
//     //     // //
//     //     // // DELETE ALL ASSIGNMENTS NOT IN MODULES
//     //     // //
//     //     // // ***************************************************


//     //     // // const assignments = [];
//     //     // // let query = `query myQuery($courseId: ID,$nextPage: String)  {
//     //     // //             course(id: $courseId) {
//     //     // //                     assignmentsConnection(
//     //     // //                         first:500,
//     //     // //                         after: $nextPage
//     //     // //                     ){
//     //     // //                         edges {
//     //     // //     node {
//     //     // //       name
//     //     // //       _id
//     //     // //       modules {
//     //     // //         name
//     //     // //       }
//     //     // //       quiz {
//     //     // //         modules {
//     //     // //           name
//     //     // //         }
//     //     // //       }
//     //     // //       discussion {
//     //     // //         modules {
//     //     // //           name
//     //     // //         }
//     //     // //       }
//     //     // //     }
//     //     // //   },
//     //     // //                         pageInfo{
//     //     // //                             endCursor,
//     //     // //                             hasNextPage
//     //     // //                         }
//     //     // //                     }
//     //     // //                 }
//     //     // //             }`;
//     //     // // let variables = { courseId: "5909", nextPage: "" };

//     //     // // let next_page = true;
//     //     // // let startTime = performance.now();
//     //     // // while (next_page) {
//     //     // //     const response = await fetch('https://<domain>.instructure.com/api/graphql', {
//     //     // //         method: "POST",
//     //     // //         headers: {
//     //     // //             "Authorization": `Bearer ${apiToken}`,
//     //     // //             "Content-type": "application/json",
//     //     // //             "Accept": "application/json"
//     //     // //         },
//     //     // //         body: JSON.stringify({
//     //     // //             query,
//     //     // //             variables: variables
//     //     // //         })
//     //     // //     });

//     //     // //     const data = await response.json();
//     //     // //     for (let assignment of data.data.course.assignmentsConnection.edges) {
//     //     // //         assignments.push(assignment.node);
//     //     // //     }
//     //     // //     if (data.data.course.assignmentsConnection.pageInfo.hasNextPage) {
//     //     // //         variables.nextPage = data.data.course.assignmentsConnection.pageInfo.endCursor
//     //     // //     } else {
//     //     // //         next_page = false;
//     //     // //     }
//     //     // // }
//     //     // // let endTime = performance.now();
//     //     // // console.log(`Total query time ${Math.floor(endTime - startTime) / 1000} seconds`);
//     //     // // console.log(assignments.length);
//     //     // // const filteredAssignments = assignments.filter((assignment) => {
//     //     // //     if (assignment.quiz) {
//     //     // //         if (assignment.quiz.modules.length < 1)
//     //     // //             return assignment;
//     //     // //     } else if (assignment.discussion) {
//     //     // //         if (assignment.discussion.modules.length < 1)
//     //     // //             return assignment;
//     //     // //     } else if (assignment.modules.length < 1) {
//     //     // //         //console.log(assignment);
//     //     // //         return assignment;
//     //     // //     }
//     //     // // });
//     //     // // console.log(filteredAssignments.length);
//     //     // // //console.log(filteredAssignments);
//     //     // // // for (let assignment of filteredAssignments) {
//     //     // // //     console.log(assignment._id);
//     //     // // // }
//     //     // // await deleteAllAssignments(null, filteredAssignments)


//     //     // // *****************************************************
//     //     // //
//     //     // // END OF DELETE ALL ASSIGNMENTS NOT IN MODULES
//     //     // //
//     //     // // *****************************************************
//     console.log('Done');
// })();

module.exports = {
    createAssignments, getAssignments, getNoSubmissionAssignments, deleteNoSubmissionAssignments, deleteAllAssignments
}
