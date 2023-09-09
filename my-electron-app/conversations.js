// conversations.js
const pagination = require('./pagination');
const csvExporter = require('./csvExporter');
//const questionAsker = require('./questionAsker');
const { deleteRequester } = require('./utilities');

const axios = require('axios');

async function getConversations(user, url, scope, token) {
    console.log('Getting conversations: ');

    let pageCounter = 1;
    const myConversations = [];
    let nextPage = `${url}&scope=${scope}`;
    console.log('My next page ', nextPage);


    // if (url === 'conversations') {
    //     myURL = `${url}?scope=${scope}&as_user_id=${user}&per_page=100`;
    // } else {
    //     myURL = url;
    // }
    // try {
    //     const response = await axios.get(nextPage, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     for (let message of response.data) {
    //         myConversations.push(message);
    //     }


    while (nextPage) {
        console.log('Page: ', pageCounter);
        try {
            const response = await axios.get(nextPage, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            for (let message of response.data) {
                myConversations.push(message);
            }
            nextPage = pagination.getNextPage(response.headers.get('link'));
            if (nextPage !== false) {
                pageCounter++;
                // myConversations = await getConversations(user, nextPage, null, myConversations, pageCount);
            } else {
                console.log('Last page.');
            }
        } catch (error) {
            console.log('ERROR: ', error);
            return false;
        }
    }

    console.log('Finshished');
    return myConversations;
}

async function deleteForAll(conversationID) {
    console.log('Deleting conversation: ', conversationID);
    let myURL = `conversations/${conversationID}/delete_for_all`;
    await axios.delete(myURL);
}

async function bulkDelete(userID, messageFilter) {
    let allConversations = [];

    // getting all messages in the inbox and sent
    allConversations.push(await getConversations(userID, 'conversations', 'inbox'));
    allConversations.push(await getConversations(userID, 'conversations', 'sent'));
    allConversations = allConversations.flat();

    console.log('done getting converations. Total: ', allConversations.length);
    let myFilter = messageFilter;
    let filteredConversations = [];
    let more = '';


    // continue looping for any exta messages that need to be deleted
    while (true) {
        console.log('filtering converations by ', myFilter);
        let counter = 0;
        filteredConversations = allConversations.filter((conversation) => {
            if (counter % 100 === 0)
                console.log('Done with ', counter);
            // console.log('looking at: ', conversation.id, conversation.subject);
            if (conversation.subject === myFilter) {
                console.log('conversation found', conversation.id)
                return conversation;
            }
            counter++;
        });
        let areYouSure = await questionAsker.questionDetails(`Found ${filteredConversations.length} are you sure you want to delete them?(y/n) `);
        if (areYouSure === 'n') {
            more = await questionAsker.questionDetails('Want to try another filter string?(y/n) ');
            if (more === 'y') {
                myFilter = await questionAsker.questionDetails('What filter do you want to use?');
                continue;
            } else
                break;
        }
        csvExporter.exportToCSV(filteredConversations, `${myFilter}`);

        // let loops = Math.floor(filteredConversations.length / 40);
        // let requests = [];
        // let index = 0;


        // ******************************
        // deleteRequester(filtersConversations, 'conversations)
        // *******************************
        await deleteRequester(filteredConversations, 'conversations', 'delete_for_all');

        // adding requests to an array to process in parallel
        // while (loops > 0) {
        //     console.log('Inside while');
        //     for (let i = 0; i < 40; i++) {
        //         console.log('adding reqeusts to promise');
        //         try {
        //             requests.push(deleteForAll(filteredConversations[index].id));
        //         } catch (error) {
        //             console.log(`Error adding ${url}`, error.message);
        //         }
        //         index++;
        //     }
        //     try {
        //         await Promise.all(requests);
        //     } catch (error) {
        //         console.log('There was an error', error.message, error.url);
        //         return;
        //     }
        //     console.log('Processed requests');
        //     await (function wait() {
        //         return new Promise(resolve => {
        //             setTimeout(() => {
        //                 resolve();
        //             }, 2000);
        //         })
        //     })();
        //     requests = [];
        //     loops--;
        // }
        // for (let i = 0; i < filteredConversations.length % 40; i++) {
        //     console.log('adding reqeusts to promise');
        //     try {
        //         requests.push(deleteForAll(filteredConversations[index].id));
        //     } catch (error) {
        //         console.log(`error adding ${filteredConversations[index]} to array`);
        //     }
        //     index++;
        // }
        // try {
        //     await Promise.all(requests);
        // } catch (error) {
        //     console.log('There was an error', error.message, error.url);
        //     return;
        // }

        if (filteredConversations.length > 0)
            console.log(`Deleted: ${filteredConversations.length} conversations`);
        more = await questionAsker.questionDetails('Do you have more?(y/n) ');
        if (more === 'y') {
            myFilter = await questionAsker.questionDetails('What filter do you want to use? ');
        } else
            break;
    }

    questionAsker.close();
}

async function bulkDeleteNew(messages, url, token) {
    console.log('Inside bulkDeleteNew');
    console.log('the token is ', token);

    return await deleteRequester(messages, url, 'delete_for_all', token);


    // let allConversations = [];

    // getting all messages in the inbox and sent
    // allConversations.push(await getConversations(userID, 'conversations', 'inbox'));
    // allConversations.push(await getConversations(userID, 'conversations', 'sent'));
    // allConversations = allConversations.flat();

    // console.log('done getting converations. Total: ', allConversations.length);
    // let myFilter = messageFilter;
    // let filteredConversations = [];
    // let more = '';


    // continue looping for any exta messages that need to be deleted
    //while (true) {
    //console.log('filtering converations by ', myFilter);
    //let counter = 0;
    // filteredConversations = allConversations.filter((conversation) => {
    //     if (counter % 100 === 0)
    //         console.log('Done with ', counter);
    //     // console.log('looking at: ', conversation.id, conversation.subject);
    //     if (conversation.subject === myFilter) {
    //         console.log('conversation found', conversation.id)
    //         return conversation;
    //     }
    //     counter++;
    // });
    // let areYouSure = await questionAsker.questionDetails(`Found ${filteredConversations.length} are you sure you want to delete them?(y/n) `);
    // if (areYouSure === 'n') {
    //     more = await questionAsker.questionDetails('Want to try another filter string?(y/n) ');
    //     if (more === 'y') {
    //         myFilter = await questionAsker.questionDetails('What filter do you want to use?');
    //         continue;
    //     } else
    //         break;
    // }
    //csvExporter.exportToCSV(filteredConversations, `${myFilter}`);

    // let loops = Math.floor(filteredConversations.length / 40);
    // let requests = [];
    // let index = 0;


    // ******************************
    // deleteRequester(filtersConversations, 'conversations)
    // *******************************
    //await deleteRequester(filteredConversations, 'conversations', 'delete_for_all');

    // adding requests to an array to process in parallel
    // while (loops > 0) {
    //     console.log('Inside while');
    //     for (let i = 0; i < 40; i++) {
    //         console.log('adding reqeusts to promise');
    //         try {
    //             requests.push(deleteForAll(filteredConversations[index].id));
    //         } catch (error) {
    //             console.log(`Error adding ${url}`, error.message);
    //         }
    //         index++;
    //     }
    //     try {
    //         await Promise.all(requests);
    //     } catch (error) {
    //         console.log('There was an error', error.message, error.url);
    //         return;
    //     }
    //     console.log('Processed requests');
    //     await (function wait() {
    //         return new Promise(resolve => {
    //             setTimeout(() => {
    //                 resolve();
    //             }, 2000);
    //         })
    //     })();
    //     requests = [];
    //     loops--;
    // }
    // for (let i = 0; i < filteredConversations.length % 40; i++) {
    //     console.log('adding reqeusts to promise');
    //     try {
    //         requests.push(deleteForAll(filteredConversations[index].id));
    //     } catch (error) {
    //         console.log(`error adding ${filteredConversations[index]} to array`);
    //     }
    //     index++;
    // }
    // try {
    //     await Promise.all(requests);
    // } catch (error) {
    //     console.log('There was an error', error.message, error.url);
    //     return;
    // }

    //     if (filteredConversations.length > 0)
    //         console.log(`Deleted: ${filteredConversations.length} conversations`);
    //     more = await questionAsker.questionDetails('Do you have more?(y/n) ');
    //     if (more === 'y') {
    //         myFilter = await questionAsker.questionDetails('What filter do you want to use? ');
    //     } else
    //         break;
    // }

    // questionAsker.close();
}


// (async () => {
//     // let theConversations = await getConversations(26);
//     // console.log('My user had this many', theConversations.length);

//     //await deleteForAll(1466);

//     let curDomain = await questionAsker.questionDetails('What Domain: ');
//     let user = await questionAsker.questionDetails('What user: ');
//     let filter = await questionAsker.questionDetails('What subject: ');

//     axios.defaults.baseURL = `https://${curDomain}/api/v1`;
//     await bulkDelete(user, filter)
//     console.log('finished');
//     questionAsker.close();
// })();


module.exports = {
    getConversations, bulkDelete, bulkDeleteNew, deleteForAll
};
