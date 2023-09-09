// users.js
// const config = require('./config.js');
const pagination = require('./pagination.js');
// const random_user = require('../random_user');
// const error_check = require('../error_check');
// const questionAsker = require('../questionAsker');
// const csvExporter = require('../csvExporter');

const axios = require('axios');

// let userData = {
//     user: {
//         terms_of_use: true,
//         skip_registration: true
//     },
//     pseudonym: {
//         send_confirmation: false
//     },
//     communication_channel: {
//         skip_confirmation: true
//     },
//     enable_sis_reactivation: true
// };

// async function getUsers(courseID, url = null, userList = []) {
//     let users = userList;
//     let myURL = url;
//     if (myURL === null) {
//         myURL = `/courses/${courseID}/users?per_page=100&include[]=enrollments`;
//     }
//     console.log(myURL);
//     try {
//         const response = await axios.get(myURL);
//         users.push(...response.data);
//         const nextPage = pagination.getNextPage(response.headers.get('link'));
//         if (nextPage !== false) {
//             users = await getUsers(null, nextPage, users);
//         }
//     } catch (error) {
//         if (error.response) {
//             console.log(error.response.status);
//             console.log(error.response.request);
//         } else if (error.request) {
//             console.log(error.request);
//         } else {
//             console.log('A different error', error.message);
//         }
//     }
//     return users;
// }

// async function createUser() {
//     console.log('Creating new user...');
//     console.log(axios.defaults.baseURL);

//     let url = 'accounts/self/users';
//     let newPerson = await error_check.errorCheck(random_user.getRandomPerson);
//     updateUserParams(newPerson);

//     let startTime = performance.now();
//     const response = await error_check.errorCheck(async () => {
//         return await axios.post(url, userData)
//     });
//     let endTime = performance.now();
//     console.log(`Created a user in ${Math.floor(endTime - startTime) / 1000} seconds`);
//     return response.data;
// }

async function getPageViews(domain, token, user_id, startDate = null, endDate = null, pageNum = 1, dupPage = []) {
    let pageViews = [];
    // let myUrl = url;
    let nextPage = `https://${domain}/api/v1/users/${user_id}/page_views?start_time=${startDate}&end_time=${endDate}&per_page=100`;
    console.log(nextPage);


    while (nextPage) {
        console.log(`Getting page ${pageNum}`);
        // const response = await error_check.errorCheck(async () => {
        //     return await axios.get(nextPage);
        // });
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        //console.log(response.data);
        pageViews.push(...response.data);

        if (response.headers.get('link')) {
            nextPage = pagination.getNextPage(response.headers.get('link'));
        } else {
            nextPage = false;
        }


        if (nextPage != false) {
            pageNum++;
            if (dupPage.includes(nextPage)) {
                console.log('This is a dupe page');
            } else {
                dupPage.push(nextPage);
            }
        }
        // for (let view of response.data) {
        //     pageViews.push(view);
        // }
    }

    // csvExporter.exportToCSV(pageViews, `${user_id}_pageViews`)
    return pageViews;
}

// function updateUserParams(person) {
//     console.log('Updating user...');
//     userData.user.name = person.firstName + ' ' + person.lastName;
//     userData.pseudonym.unique_id = person.loginID.toString();
//     userData.pseudonym.sis_user_id = person.email;
//     userData.communication_channel.address = person.email;

//     return;
// }

// async function clearUserCache(userID) {
//     console.log('Clearing user cache for ', userID);

//     await axios.post(`/users/${userID}/clear_cache`);
// }

// async function clearCourseUserCache(courseID) {
//     console.log('Clearing cache of every user in the course', courseID);

//     let userList = await getUsers(courseID);
//     for (let user of userList)
//         await clearUserCache(user.id);

//     return;
// }

// (async () => {
//     const curDomain = await questionAsker.questionDetails('What domain: ');
//     // const courseID = await questionAsker.questionDetails('What course: ');
//     const userID = await questionAsker.questionDetails('What user: ');
//     // const number = await questionAsker.questionDetails('How many users do you want to create: ');
//     const startDate = await questionAsker.questionDetails('Start date (yyyy-mm-dd): ');
//     const endDate = await questionAsker.questionDetails('End date (yyyy-mm-dd): ');
//     questionAsker.close();

//     axios.defaults.baseURL = `https://${curDomain}/api/v1`;


//     // for (let i = 0; i < numUsers; i++) {
//     //     let user = await createUser();
//     //     console.log(user.id);
//     // }
//     // let myUsers = await getUsers(2155);
//     // console.log(myUsers.length);

//     // let myPageViews = await getPageViews(26, null,
//     //     '2023-02-15T07:00:00.000', '2023-02-16T07:00:00.000');
//     // console.log(`${myPageViews.length} Page views`);
//     // csvExporter.exportToCSV(myPageViews);
//     // console.log(myPageViews.length);

//     // await clearCourseUserCache(2155);
//     await getPageViews(userID, startDate, endDate)
//     console.log('done');
// })();

module.exports = {
    // getUsers,
    // createUser,
    getPageViews
};
