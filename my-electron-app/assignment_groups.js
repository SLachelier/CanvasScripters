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
const { deleteRequester } = require('./utilities');
const axios = require('axios');


// const axios = config.instance;
const assignmentGroups = [];


async function createAssignmentGroups(course, params = {}, number) {
    let url = `courses/${course}/assignment_groups/`;
    startTime = performance.now();
    let counter = 0;
    for (let i = 0; i < number; i++) {
        let name = `Assignment Group ${i}`;
        params.name = name;
        try {
            const response = await axios.post(url, params);
        } catch (error) {
            if (error.response) {
                console.log(error.response);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Something else happened');
            }
        }
        counter++;
    }
    endTime = performance.now();
    console.log(`Created ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`);
}

async function getAssignmentGroups(domain, course, token) {
    let url = `https://${domain}/api/v1/courses/${course}/assignment_groups?include[]=assignments&per_page=100`;
    let assignmentGroups = [];
    let nextPage = url;

    console.log(nextPage);
    while (nextPage) {
        try {
            const response = await axios.get(nextPage, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.headers.get('link')) {
                nextPage = pagination.getNextPage(response.headers.get('link'));
            } else {
                nextPage = false;
            }

            console.log(nextPage);

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

async function getEmptyAssignmentGroups(domain, course, token) {
    // let url = `https://${domain}/courses/${course}/assignment_groups/`;
    const theAssignmentGroups = await getAssignmentGroups(domain, course, token);
    if (!theAssignmentGroups) {
        return false;
    }


    const emptyAssignmentGroups = theAssignmentGroups.filter(assignmentGroup => {
        if (assignmentGroup.assignments.length < 1)
            return assignmentGroup;
    });

    return emptyAssignmentGroups;
}

async function deleteEmptyAssignmentGroups(domain, course, token, emptyGroups) {
    //let url = `/courses/${course}/assignment_groups/`;
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
    return await deleteRequester(emptyGroups, `https://${domain}/api/v1/courses/${course}/assignment_groups`, null, token)

    // console.log('Number of assignment groups to delete', emptyAssignmentGroups.length);
    // try {
    //     const startTime = performance.now();
    //     let counter = 0;
    //     for (let emptyGroup of emptyAssignmentGroups) {
    //         console.log('deleting assignment group');
    //         const response = await axios.delete(url + emptyGroup.id)
    //         counter++;
    //     }
    //     const endTime = performance.now();
    //     console.log(`Deleted ${counter} assignment group(s) in ${Math.floor(endTime - startTime) / 1000} seconds.`)
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
    createAssignmentGroups, getAssignmentGroups, getEmptyAssignmentGroups, deleteEmptyAssignmentGroups
}
