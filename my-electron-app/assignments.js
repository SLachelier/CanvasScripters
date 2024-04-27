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
    // let url = `courses/${course}/assignments`;
    // const data = {
    //     assignment: {
    //         name: 'Assignment 1',
    //         submission_types: [
    //             'online_upload',
    //         ],
    //         allowed_extensions: [
    //         ],
    //         points_possible: 10,
    //         grading_type: 'points',
    //         post_to_sis: false,
    //         due_at: null,
    //         lock_at: null,
    //         unlock_at: null,
    //         description: 'This is the assignment description',
    //         published: false,
    //         anonymous_grading: false,
    //         allowed_attempts: -1,
    //     }
    // }

    // try {
    //     let counter = 0;
    //     let startTime = performance.now();
    //     for (let num = 1; num <= number; num++) {
    //         data.assignment.name = `Assignment ${num}`;
    //         const response = await axios.post(url, data);
    //         counter++;
    //     }
    //     let endTime = performance.now();
    //     console.log(`Created ${counter} assignment(s) in ${Math.floor(endTime - startTime) / 1000} seconds`)
    // } catch (error) {
    //     if (error.response) {
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //     } else if (error.request) {
    //         console.log(error.request);
    //     } else {
    //         console.log('A different error', error.message);
    //     }
    // }


    //*******************************************
    //
    // Using Graph QL to create assignments
    //
    //********************************************

    const createAssignmentMutation = `mutation createAssignments($courseId: ID!,$name: String!) {
        createAssignment(input: {
            courseId: $courseId,
            name: $name,
            description: "This is the description",
            pointsPossible: 5,
            gradingType: points,
            submissionTypes: online_upload
        }) {
            assignment {
                _id
            }
            errors {
                attribute
                message
            }
        }
    }`

    const mutationVariables = {
        "courseId": course,
        "name": `Assignment `
    };

    const response = await axios.post('https://ckruger.instructure.com/api/graphql', {
        query: createAssignmentMutation,
        variables: mutationVariables
    });

    const data = await response.data;

    console.log(data);
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
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };



    // const assignments = await getAssignments(domain, courseID, token);
    const query = `query getNoSubmissionAssignments($states: [SubmissionState!]) {
        course(id: "2165") {
            assignmentsConnection(filter: {gradingPeriodId: null}) {
                edges {
                    node {
                        id
                        _id
                        hasSubmittedSubmissions
                        submissionsConnection(filter: {states: $states}) {
                            nodes {
                                _id
                                gradingStatus
                            }
                        }
                    }
                }
            }
        }
    }`

    const variables = {
        "states": ["unsubmitted", "ungraded"]
    }

    const config = {
        method: 'post',
        url: `https://ckruger.instructure.com/api/graphql`,
        headers: headers,
        data: JSON.stringify({
            query: query,
            variables: variables
        })

    }

    try {
        const response = await axios.post(`https://ckruger.instructure.com/api/graphql`, JSON.stringify({
            query: query,
            variables: variables
        }), {
            headers: {

                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

            }
        });

        console.log(response.data);
        return response.data.data.course.assignmentsConnection.edges;
    } catch (error) {
        console.log(error)
    }
    // const noSubmissionAssignments = assignments.filter(assignment => {
    //     if (graded) {
    //         if (!assignment.has_submitted_submissions) {
    //             return assignment;
    //         }
    //     } else {
    //         if (!assignment.graded_submissions_exist) {
    //             return assignment;
    //         }
    //     }
    // });


    // return noSubmissionAssignments;
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

// async function deleteAllAssignments(courseID, assignments) {
//     //let assignments = await getAssignments(courseID);
//     for (const assignment of assignments) {
//         //console.log('assignment id ', assignment._id);
//         let url = `https://${domain}/api/v1/courses/5909/assignments/${assignment._id}`;
//         //console.log(url);
//         try {
//             const response = await axios.delete(url);
//         } catch (error) {
//             console.log('There was an error', error.message);
//         }
//     }
// }

//***************************************************
//
//    DELETE ALL ASSIGNMENTS NOT IN MODULES
//
//***************************************************
async function getNonModuleAssignments(domain, courseID, token) {
    console.log('assignments.js > getNonModuleAssignments');
    const assignments = [];

    let query = `
        query myQuery($courseId: ID,$nextPage: String)  {
            course(id: $courseId) {
                assignmentsConnection(first:500, after: $nextPage) {
                    edges {
                        node {
                            name
                            _id
                            modules {
                                name
                            }
                            quiz {
                                modules {
                                    name
                                }
                            }
                            discussion {
                                modules {
                                    name
                                }
                            }
                        }
                    },
                    pageInfo {
                        endCursor,
                        hasNextPage
                    }
                }
            }
        }`;
    let variables = { courseId: courseID, nextPage: "" };

    const axiosConfig = {
        method: 'post',
        url: `https://${domain}/api/graphql`,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        data: {
            query,
            variables: variables
        }
    };

    let next_page = true;
    //let startTime = performance.now();
    while (next_page) {
        try {
            const response = await axios(axiosConfig);

            const data = response.data;
            // console.log(data);

            for (let assignment of data.data.course.assignmentsConnection.edges) {
                assignments.push(assignment.node);
            }
            if (data.data.course.assignmentsConnection.pageInfo.hasNextPage) {
                variables.nextPage = data.data.course.assignmentsConnection.pageInfo.endCursor
            } else {
                next_page = false;
            }
        } catch (err) {
            console.log(err);
            // next_page = false;
            return false;
        }

        // const data = await response.json();




        //     //     // // let endTime = performance.now();
        //     //     // // console.log(`Total query time ${Math.floor(endTime - startTime) / 1000} seconds`);
        //     //     // // console.log(assignments.length);

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
    }
    const filteredAssignments = assignments.filter((assignment) => {
        if (assignment.quiz) {
            if (assignment.quiz.modules.length < 1)
                return assignment;
        } else if (assignment.discussion) {
            if (assignment.discussion.modules.length < 1)
                return assignment;
        } else if (assignment.modules.length < 1) {
            //console.log(assignment);
            return assignment;
        }
    });

    const updatedID = filteredAssignments.map((assignment) => {
        return {
            name: assignment.name,
            id: assignment._id
        };
    });

    return updatedID;
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


//     console.log('Done');
// }) ();

module.exports = {
    createAssignments, getAssignments, getNoSubmissionAssignments, deleteNoSubmissionAssignments, getNonModuleAssignments
}
