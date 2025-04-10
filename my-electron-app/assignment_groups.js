// assignment_groups.js imports
//
// createAssignmentGroups(course, params, number)
// ---------------------
// getAssignmentGroups(course, params)
// ---------------------------------
// deleteEmptyAssignmentGroups(course)
// -------------------------------------

const pagination = require('./pagination.js');
//const questionAsker = require('./questionAsker');
const { deleteRequester, errorCheck } = require('./utilities');
const axios = require('axios');


// const axios = config.instance;
const assignmentGroups = [];


async function createAssignmentGroups(data) {
    let url = `https://${data.domain}/api/v1/courses/${data.course}/assignment_groups`;
    let token = data.token;

    const axiosConfig = {
        method: 'post',
        url: url,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            name: 'Assignment Group',
            position: 1
        }
    }

    try {
        const request = async () => {
            return await axios(axiosConfig);
        };

        const response = await errorCheck(request);

        return response.data.id;
    } catch (error) {
        throw error
    }



    // startTime = performance.now();
    // let counter = 0;
    // for (let i = 0; i < number; i++) {
    //     let name = `Assignment Group ${i}`;
    //     params.name = name;
    //     try {
    //         const response = await axios.post(url, params);
    //     } catch (error) {
    //         if (error.response) {
    //             console.log(error.response);
    //         } else if (error.request) {
    //             console.log(error.request);
    //         } else {
    //             console.log('Something else happened');
    //         }
    //     }
    //     counter++;
    // }
    // endTime = performance.now();
    // console.log(`Created ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`);
}

async function getAssignmentGroups(domain, course, token) {



    let url = `https://${domain}/api/v1/courses/${course}/assignment_groups?include[]=assignments&per_page=100`;
    let assignmentGroups = [];
    let nextPage = url;

    //console.log(nextPage);
    while (nextPage) {
        try {
            const response = await axios.get(nextPage, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.headers.get('link')) {
                nextPage = pagination.getNextPage(response.headers.get('link'));
                console.log(nextPage);
            } else {
                nextPage = false;
                console.log('No more assignment groups');
            }

            for (let group of response.data) {
                assignmentGroups.push(group);
            }

        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('A different error', error.message);
            }
            return false;
        }
    }

    return assignmentGroups;
}

async function getEmptyAssignmentGroups(data) {
    let emptyAssignmentGroups = [];

    const domain = data.domain;
    const course = data.course;
    const token = data.token;

    const query = `query getAssignmentGroups($courseID: ID!, $nextPage: String) {
                        course(id: $courseID) {
                            assignmentGroupsConnection(first: 200, after: $nextPage) {
                                pageInfo {
                                    endCursor
                                    hasNextPage
                                }
                                nodes {
                                    state
                                    _id
                                    assignmentsConnection {
                                        nodes {
                                            _id
                                        }
                                    }
                                }
                            }
                        }
                    }`;
    const variables = {
        "courseID": course,
        "nextPage": ''
    };

    const axiosConfig = {
        method: 'post',
        url: `https://${domain}/api/graphql`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: {
            query: query,
            variables: variables
        }
    };

    let hasNextPage = true;
    while (hasNextPage) {
        try {
            const request = async () => {
                return await axios(axiosConfig);
            }

            const response = await errorCheck(request);
            if (response.data.data.course) {
                const data = response.data.data.course.assignmentGroupsConnection;

                emptyAssignmentGroups.push(...data.nodes.filter((group) => {
                    return (group.assignmentsConnection.nodes.length < 1 && group.state != 'deleted');
                }));

                if (!data.pageInfo.hasNextPage) {
                    hasNextPage = false;
                } else {
                    variables.nextPage = data.pageInfo.endCursor;
                }
            } else {
                let newError = {
                    status: "Unknown",
                    message: "Error course ID couldn't be found."
                }
                throw newError;
            }
        } catch (error) {
            throw error
        }
    }


    // // let url = `https://${domain}/courses/${course}/assignment_groups/`;
    // const theAssignmentGroups = await getAssignmentGroups(domain, course, token);
    // if (!theAssignmentGroups) {
    //     return false;
    // }


    // const emptyAssignmentGroups = theAssignmentGroups.filter(assignmentGroup => {
    //     if (assignmentGroup.assignments.length < 1)
    //         return assignmentGroup;
    // });

    return emptyAssignmentGroups;
}

async function deleteEmptyAssignmentGroup(data) {
    console.log('assignment_groups.js > deleteEmptyAssignmentGroup');
    let url = `${data.domain}/${data.groupID}`;

    const axiosConfig = {
        method: 'delete',
        url: url,
        headers: {
            'Authorization': `Bearer ${data.token}`
        }
    };

    try {
        const request = async () => {
            return await axios(axiosConfig);
        };

        const response = await errorCheck(request);
        return response.data.id;
    } catch (error) {
        throw error;
    }

    // let params = {
    //     include: ['assignments']
    // };

    //console.log('getting empty assignment groups');
    // const theAssignmentGroups = await getAssignmentGroups(course);


    // const emptyAssignmentGroups = theAssignmentGroups.filter(assignmentGroup => {
    //     if (assignmentGroup.assignments.length < 1)
    //         return assignmentGroup;
    // });

    //const emptyAssignmentGroups = await getEmptyAssignmentGroups(course);

    // *******************************************************************
    //
    // deleterequester does requests in parallel and there are some issues
    //  currently with deleting assignment groups, commenting out for now
    //
    // *********************************************************************


    // return await deleteRequester(emptyGroups, `https://${domain}/api/v1/courses/${course}/assignment_groups`, null, token)

    // console.log('Number of assignment groups to delete', emptyAssignmentGroups.length);
    // try {
    //     //const startTime = performance.now();
    //     let counter = 0;
    //     for (let emptyGroup of emptyGroups) {
    //         console.log('deleting assignment group');
    //         const response = await axios({
    //             method: 'delete',
    //             url: url + emptyGroup.id,
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         counter++;
    //     }
    //     return true;
    //     //const endTime = performance.now();
    //     // console.log(`Deleted ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`)
    // } catch (error) {
    //     console.log('error deleting assignment group');
    //     if (error.response) {
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //     } else if (error.request) {
    //         console.log(error.request);
    //     } else {
    //         console.log('A different error', error.message);
    //     }
    //     return false;
    // }
}

// (async () => {
//     const curDomain = await questionAsker.questionDetails('What domain: ');
//     const courseID = await questionAsker.questionDetails('What course: ');
//     //const number = await questionAsker.questionDetails('How many assignments do you want to create: ');
//     questionAsker.close();

//     axios.defaults.baseURL = `https://${curDomain}/api/v1`;

//     // await createAssignmentGroups(`courses/${theCourse}/assignment_groups`, {}, 10);
//     // let myAssignmentGroups = await getAssignmentGroups(`courses/${theCourse}/assignment_groups`);
//     // console.log(myAssignmentGroups.length);

//     await deleteEmptyAssignmentGroups(courseID);

//     console.log('Done.');
// })();

module.exports = {
    createAssignmentGroups, getAssignmentGroups, getEmptyAssignmentGroups, deleteEmptyAssignmentGroup
}
