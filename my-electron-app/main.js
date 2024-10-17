const path = require('path');
const fs = require('fs');
const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    clipboard,
    Menu
} = require('electron');
//const axios = require('axios');
const convos = require('./conversations');
const csvExporter = require('./csvExporter');
const assignmentGroups = require('./assignment_groups');
const assignments = require('./assignments');
const { getPageViews } = require('./users');
const { send } = require('process');
const { deleteRequester, waitFunc } = require('./utilities');
const { emailCheck, checkCommDomain, checkUnconfirmedEmails, confirmEmail, resetEmail } = require('./comm_channels');
const { resetCourse } = require('./courses');

let mainWindow;
let suppressedEmails = [];

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, './preload.js')
        }
    })

    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {

    ipcMain.handle('axios:getConvos', async (event, data) => {
        console.log('Inside main:getConvos');
        // console.log(searchData);

        //const searchQuery = JSON.parse(searchData);
        // const domain = searchData.domain;
        // const userID = searchData.user_id;
        // const apiToken = searchData.token;
        // const subject = searchData.subject;

        // const inboxMessages = [];
        // const sentMessages = [];
        // const totalMessages = [];

        // console.log('The domain ', domain);
        // console.log('The userID ', userID);
        // console.log('The apiToken ', apiToken);

        // getting messages in 'inbox'

        // let url = `https://${domain}/api/v1/conversations?as_user_id=${userID}&per_page=100`;
        // console.log(url);

        //setting up graphql Query for messages


        // let query = `query MyQuery {
        //     legacyNode(type: User, _id: "26") {
        //         ...on User {
        //             email
        //         }
        //     }
        // }`

        let sentMessages;
        try {
            sentMessages = await convos.getConversationsGraphQL(data);
            return sentMessages;
        } catch (error) {
            throw error.message;
        }

        // const inboxMessages = await convos.getConversations(userID, url, 'inbox', apiToken);
        // if (!inboxMessages) {
        //     return false;
        // }
        // console.log('Total inbox messages: ', inboxMessages.length)

        // getting messages in 'sent'
        // const sentMessages = await convos.getConversations(userID, url, 'sent', apiToken);

        // let url = `https://${domain}/api/graphql?as_user_id=${userID}`;
        // const sentMessages = await convos.getConversationsGraphQL(url, query, variables, apiToken);
        //console.log('Returned messages: ', sentMessages);

        // console.log('Total sent messages', sentMessages.length);

        // const totalMessages = [...sentMessages];
        // console.log('Total messages ', totalMessages.length);


    });

    ipcMain.handle('axios:deleteConvos', async (event, data) => {
        console.log('inside axios:deleteConvos');

        let completedRequests = 0;
        const totalRequests = data.messages.length;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }

        const request = async (requestData) => {
            try {
                const response = await convos.deleteForAll(requestData);
                return response;
            } catch (error) {
                throw error;
            } finally {
                updateProgress();
            }
        };

        let requests = [];
        data.messages.forEach((message) => {
            const requestData = {
                domain: data.domain,
                token: data.token,
                message: message.id
            }
            requests.push(() => request(requestData));
        })

        const batchResponse = await batchHandler(requests);

        return batchResponse;
    });

    ipcMain.handle('axios:checkCommChannel', async (event, data) => {
        console.log('inside axios:checkCommChannel');

        try {
            const response = await emailCheck(data);
            return response;
        } catch (error) {
            throw error.message;
        }

    });

    ipcMain.handle('axios:checkCommDomain', async (event, data) => {
        console.log('inside axios:checkCommDomain');
        suppressedEmails = [];

        // handle 1000 items at a time to prevent max call stack size exceeded
        function processLargeArray(largeArray) {
            const chunkSize = 1000;
            for (let i = 0; i < largeArray.length; i += chunkSize) {
                const chunk = largeArray.slice(i, i + chunkSize);
                suppressedEmails.push(...chunk);
            }
        }
        // const fakeEmails = Array.from({ length: 20 }, (_, i) => `fake${i + 1}@example.com`);
        // suppressedEmails.push(...fakeEmails);

        try {
            const response = await checkCommDomain(data);
            processLargeArray(response);

            // suppressedEmails.push(...response);
            if (suppressedEmails.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    });

    ipcMain.handle('axios:createAssignments', async (event, data) => {
        console.log('inside axios:createAssignments');

        let completedRequests = 0;
        let totalRequests = data.number;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }

        const request = async (data) => {
            try {
                // const response = await window.axios.deleteTheThings(messageData);
                const response = await assignments.createAssignments(data);
                return response;
            } catch (error) {
                //console.error('Error: ', error);
                throw error;
            } finally {
                updateProgress();
            }
        }

        let requests = [];
        for (let i = 0; i < data.number; i++) {
            requests.push(() => request(data));
        }

        const batchResponse = await batchHandler(requests);


        return batchResponse;
    });

    ipcMain.handle('axios:deleteAssignments', async (event, data) => {
        console.log('inside axios:deleteAssignments');

        let completedRequests = 0;
        let totalRequests = data.number;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }

        const request = async (data) => {
            try {
                // const response = await window.axios.deleteTheThings(messageData);
                const response = await assignments.deleteAssignments(data);
                return response;
            } catch (error) {
                console.error('Error: ', error);
                throw error;
            } finally {
                updateProgress();
            }
        }

        let requests = [];
        for (let assignment of data.assignments) {
            requests.push(() => request({ endpoint: data.url, token: data.token, id: assignment.id }));
        }

        const batchResponse = await batchHandler(requests);
        console.log('Finished deleting assignments.');
        return batchResponse;
    });

    ipcMain.handle('axios:getEmptyAssignmentGroups', async (event, data) => {
        console.log('Inside axios:getEmptyAssignmentGroups')

        try {
            const aGroups = await assignmentGroups.getEmptyAssignmentGroups(data);

            return aGroups;
        } catch (error) {
            throw error.message;
        }

    });

    ipcMain.handle('axios:deleteEmptyAssignmentGroups', async (event, data) => {
        console.log('Inside axios:deleteEmptyAssignmentGroups')

        let completedRequests = 0;
        const totalRequests = data.content.length;
        // let batchResponse = null;
        // let failed = [];

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }


        const request = async (data) => {
            try {
                const response = await assignmentGroups.deleteEmptyAssignmentGroup(data);
                return response;
            } catch (error) {
                throw error;
            } finally {
                updateProgress();
            }
        }

        let requests = [];
        let requestCounter = 1;
        data.content.forEach((group) => {
            const requestData = {
                domain: data.url,
                token: data.token,
                groupID: group._id
            }
            requests.push({ id: requestCounter, request: () => request(requestData) });
            requestCounter++;
        });

        // batchResponse = await batchHandler(requests);
        // failed = batchResponse

        const responses = [];
        for (let request of requests) {
            responses.push(await request.request());
        }

        const formattedResponses = {
            successful: [], failed: []
        };
        
        formattedResponses.successful = responses.filter(response => !isNaN(response));
        formattedResponses.failed = responses.filter(response => isNaN(response));
        
        console.log('Finished Deleting Empty Assignment groups.');
        return formattedResponses;
    });

    ipcMain.handle('axios:getNoSubmissionAssignments', async (event, data) => {
        console.log('main.js > axios:getNoSubmissionAssignments');

        try {
            const result = await assignments.getNoSubmissionAssignments(data.domain, data.course, data.token, data.graded);

            return result;
        } catch (error) {
            console.log(error);
            throw error.message;
        }

    });

    // ipcMain.handle('axios:deleteNoSubmissionAssignments', async (event, data) => {
    //     console.log('main.js > axios:deleteNoSubmissionAssignments');

    //     const result = await assignments.deleteNoSubmissionAssignments(data.domain, data.course, data.token, data.assignments);

    //     return result;
    // });

    ipcMain.handle('axios:getUnpublishedAssignments', async (event, data) => {
        console.log('main.js > axios:getUnpublishedAssignments');

        try {
            const results = await assignments.getUnpublishedAssignments(data.domain, data.course, data.token);

            return results;
        } catch (error) {
            throw error.message;
        }
    });

    ipcMain.handle('axios:getNonModuleAssignments', async (event, data) => {
        console.log('main.js > axios:getNonModuleAssignments');

        try {
            const results = await assignments.getNonModuleAssignments(data.domain, data.course, data.token);
            return results;
        } catch (error) {
            throw error.message;
        }
    });

    ipcMain.handle('axios:getAssignmentsToMove', async (event, data) => {
        console.log('main.js > axios:getAssignmentsToMove');

        // 1. Get all assignments
        // 2. Get assignment group id of first assignment
        // 3. Move all assignments to that group

        try {
            const results = await assignments.getAssignmentsToMove(data.domain, data.course, data.token);
            return results;
        } catch (error) {
            throw error.message;
        }
    });

    ipcMain.handle('axios:moveAssignmentsToSingleGroup', async (event, data) => {
        console.log('main.js > axios:moveAssignmentsToSingleGroup');

        let completedRequests = 0;
        let totalRequests = data.number;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }

        const request = async (data) => {
            try {
                const response = await assignments.moveAssignmentToGroup(data)
                return response;
            } catch (error) {
                console.error('Error in getNonModuleAssignments: ', error);
                throw `status code ${error.status} - ${error.message}`;
            } finally {
                updateProgress();
            }
        }

        const requests = [];
        for (let assignment of data.assignments) {
            requests.push(() => request({ url: data.url, token: data.token, id: assignment._id, groupID: data.groupID }))
        }

        const batchResponse = await batchHandler(requests);
        return batchResponse;
    });

    ipcMain.handle('axios:createAssignmentGroups', async (event, data) => {

        let completedRequests = 0;
        let totalRequests = data.number;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        }

        const request = async (data) => {
            try {
                const response = await assignmentGroups.createAssignmentGroups(data);
                return response;
            } catch (error) {
                throw error
            } finally {
                updateProgress();
            }
        };

        const requests = [];
        for (let i = 0; i < totalRequests; i++) {
            requests.push({ id: i+1, request: () => request(data) });
        }

        const batchResponse = await batchHandler(requests);

        return batchResponse;
    });
    // ipcMain.handle('axios:deleteTheThings', async (event, data) => {
    //     console.log('Inside axios:deleteTheThings')

    //     // const result = deleteRequester(data.content, data.url, null, data.token);
    //     // const result = await assignmentGroups.deleteEmptyAssignmentGroups(data.domain, data.course, data.token, data.groups);
    //     const batchResponse = await batchHandler(data, data.action);

    //     return result;
    // });

    ipcMain.handle('axios:getPageViews', async (event, data) => {
        console.log('main.js > axios:getPageViews');

        let response;
        try {
            response = await getPageViews(data);
        } catch (error) {
            throw error.message
        }

        // if (!response) {
        //     return response;
        // }
        // console.log(response.length);
        if (response.length > 0) {
            //const filteredResults = convertToPageViewsCsv(result);

            const filename = `${data.user}_page_views.csv`;
            const fileDetails = getFileLocation(filename);
            if (fileDetails) {
                await csvExporter.exportToCSV(response, fileDetails);
            } else {
                return 'cancelled';
            }
            return true;
        } else {
            console.log('no page views');
            return false;
        }
    });

    ipcMain.handle('axios:resetCourses', async (event, data) => {
        console.log('main.js > axios:resetCourses');

        let completedRequests = 0;
        const totalRequests = data.courses.length;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100)
        }

        const request = async (requestData) => {
            try {
                const response = await resetCourse(requestData);
                return response;
            } catch (error) {
                throw error;
            } finally {
                updateProgress();
            }
        }

        const requests = [];
        data.courses.forEach((course) => {
            const requestData = {
                domain: data.domain,
                token: data.token,
                course: course
            };
            requests.push(() => request(requestData));
        })

        const batchResponse = await batchHandler(requests);
        return batchResponse;
    });

    ipcMain.handle('axios:resetCommChannel', async (event, data) => {
        try {
            const response = await resetEmail(data);
            return response;
        } catch (error) {
            throw error;
        }
    });

    ipcMain.handle('axios:checkUnconfirmedEmails', async (event, data) => {
        try {
            const response = await checkUnconfirmedEmails(data); //returns a data stream to write to file
            const filePath = getFileLocation('unconfirmed_emails.csv')
            const wStream = fs.createWriteStream(filePath);

            response.pipe(wStream);

            return new Promise((resolve, reject) => {
                wStream.on('finish', resolve)
                wStream.on('error', (error) => {
                    reject(error);
                })
            }).catch((error) => {
                if (error.code === 'EBUSY') {
                    throw new Error('File write failed. resource busy, locked or open. Make sure you\'re not trying to overwrite a file currently open.');
                }
                throw new Error('File write failed: ', error.message);
            });
        } catch (error) {
            throw error;
        }
    });

    ipcMain.handle('axios:confirmEmails', async (event, data) => {
        console.log('main.js > axios:resetCourses');

        let completedRequests = 0;
        const totalRequests = data.emails.length;

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100)
        }

        const request = async (requestData) => {
            try {
                const response = await confirmEmail(requestData);
                return response;
            } catch (error) {
                throw error;
            } finally {
                updateProgress();
            }
        }

        const requests = [];
        data.emails.forEach((email) => {
            const requestData = {
                domain: data.domain,
                token: data.token,
                email: email
            };
            requests.push(() => request(requestData));
        })

        const batchResponse = await batchHandler(requests);
        let confirmedCount = 0;
        batchResponse.successful.forEach((success) => {
            if (success.id.confirmed) {
                confirmedCount++;
            }
        });
        const reMappedResponse = {
            failed: batchResponse.failed,
            successful: batchResponse.successful,
            confirmed: confirmedCount
        };
        return reMappedResponse;
    })

    ipcMain.handle('axios:resetEmails', async (event, data) => {
        const fileContents = await getFileContents('txt');
        if (fileContents != 'cancelled') {
            const emails = removeBlanks(fileContents.split(/\r?\n|\r|\,/))
                .map((email) => { // remove spaces
                    return email.trim();
                });

            const totalRequests = emails.length;
            let completedRequests = 0;

            const updateProgress = () => {
                completedRequests++;
                mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
            };

            const request = async (requestData) => {
                try {
                    const response = await resetEmail(requestData);
                    return response;
                } catch (error) {
                    throw error;
                } finally {
                    updateProgress();
                }
            };

            const requests = [];
            emails.forEach((email) => {
                const requestData = {
                    domain: data.domain,
                    token: data.token,
                    region: data.region,
                    email: email
                };
                requests.push(() => request(requestData));
            })

            const batchResponse = await batchHandler(requests);
            return batchResponse;
        } else {
            throw new Error('Cancelled');
        }
    });
    ipcMain.handle('fileUpload:confirmEmails', async (event, data) => {

        let emails = [];
        // get the file contents
        try {

            const fileContent = await getFileContents('txt');
            emails = removeBlanks(fileContent.split(/\r?\n|\r|\,/))
                .map((email) => { // remove spaces
                    return email.trim();
                });
        } catch (error) {
            throw error;
        }

        // ********************************
        // handle the bulk requests for 
        //  confirming the emails
        // ********************************
        const totalRequests = emails.length;
        let completedRequests = 0;

        mainWindow.webContents.send('email-count', totalRequests);

        const updateProgress = () => {
            completedRequests++;
            mainWindow.webContents.send('update-progress', (completedRequests / totalRequests) * 100);
        };

        const request = async (data) => {
            try {
                const response = await confirmEmail(data);
                return response;
            } catch (error) {
                throw error;
            } finally {
                updateProgress();
            }
        }

        const requests = [];
        for (let email of emails) {
            data.email = email;
            requests.push(() => request(data));
        };

        const batchResponse = await batchHandler(requests);
        let confirmedCount = 0;
        batchResponse.successful.forEach((success) => {
            if (success.id.confirmed) {
                confirmedCount++;
            }
        });
        const reMappedResponse = {
            failed: batchResponse.failed,
            successful: batchResponse.successful,
            confirmed: confirmedCount
        };
        return reMappedResponse;
    })

    ipcMain.handle('fileUpload:resetEmails', async (event, data) => {
        const fileContent = await getFileContents('txt');

        return true;
    });
    ipcMain.handle('fileUpload:resetCourses', async (event) => {
        let courses = [];
        try {
            const fileContent = await getFileContents('txt');
            courses = removeBlanks(fileContent.split(/\r?\n|\r|\,/))
                .filter((course) => !isNaN(Number(course)))
                .map((course) => { // remove spaces
                    return course.trim();
                });
        } catch (error) {
            throw error;
        }
        return courses;
    })

    ipcMain.handle('csv:sendToCSV', () => {
        sendToCSV(data);
    });

    ipcMain.on('csv:sendToText', () => {
        console.log('csv:sendToText');

        try {
            sendToTxt(suppressedEmails);
        } catch (error) {
            console.log('There was an error in the sendToText');
        }
    })

    ipcMain.on('testAPI:testing', () => {
        console.log('main.js > testAPI:testing');
    });

    // right click menu
    ipcMain.on('right-click', (event) => {
        const template = [
            {
                label: 'Copy',
                click: () => {
                    const text = clipboard.readText();
                    event.sender.send('context-menu-command', { command: 'copy', text: text });
                }
            },
            {
                label: 'Cut',
                click: () => {
                    event.sender.send('context-menu-command', { command: 'cut', text: null })
                }
            },
            {
                label: 'Paste',
                click: () => {
                    const text = clipboard.readText();

                    event.sender.send('context-menu-command', { command: 'paste', text: text })
                }
            },
        ]
        const menu = Menu.buildFromTemplate(template)
        menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
    });

    ipcMain.on('write-text', (event, data) => {
        clipboard.writeText(data);
    });
    //ipcMain.handle('')
    createWindow();

    // for mac os creates new window when activated
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })


})

// for windows and linux closes app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

async function getFileContents(ext) {
    const options = {
        properties: ['openFile'],
        filters: [{ name: '', extensions: [ext] }],
        modal: true
    };

    const result = await dialog.showOpenDialog(mainWindow, options);

    if (result.canceled) {
        return 'cancelled';
    } else {
        console.log(result.filePaths);
        const filePath = result.filePaths[0];
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        // const emails = removeBlanks(fileContent.split(/\r?\n|\r|,/));
        return fileContent;
    }
}

function removeBlanks(arr) {
    return arr.filter((element) => element.length > 0);
}

function sendToCSV(data) {
    console.log('inside sendToCSV()');
    //console.log(data);

    const fileDetails = getFileLocation(data.fileName)
    if (fileDetails) {
        csvExporter.exportToCSV(data.data, fileDetails);
    } else {
        return false;
    }
}

function sendToTxt(data) {
    console.log('inside sendToTxt');

    const fileDetails = getFileLocation('suppressed_emails.txt');
    if (fileDetails) {
        csvExporter.exportToTxt(data, fileDetails)
    } else {
        throw new Error('Failed to write file.');
    }
}

function getFileLocation(fileName) {
    const fileDetails = dialog.showSaveDialogSync({
        defaultPath: fileName,
        properties: [
            'createDirectory',
            'showOverwriteConfirmation',
        ]
    });
    return fileDetails;
}

function convertToPageViewsCsv(data) {

    const csvHeaders = [];
    const csvRows = [];

    // create the headers for the csv
    for (const key in data[0]) {
        // check if key is also an object
        if (typeof (data[0][key]) === 'object' && data[0][key] !== null) {
            for (const nkey in data[0][key]) {
                csvHeaders.push(nkey);
            }
        } else {
            csvHeaders.push(key);
        }
    }

    // convert headers to comma separated string
    csvRows.push(csvHeaders.map(header => `"${header}"`).join(','));

    // loop through each object and push the values 
    // onto the array as a comma separated string
    for (const row of data) {
        const values = csvHeaders.map((header) => {
            let value;
            switch (header) {
                case 'user':
                    value = row.links.user;
                    break;
                case 'context':
                    value = row.links.context;
                    break;
                case 'asset':
                    value = row.links.asset;
                    break;
                case 'real_user':
                    value = row.links.real_user;
                    break;
                case 'account':
                    value = row.links.account;
                    break;
                default:
                    value = row[header];
                    break;
            }
            return isNaN(value) ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
    }
    return csvRows;
}

async function batchHandler(requests, batchSize = 35, timeDelay = 2000) {
    let myRequests = requests
    const successful = [];
    let failed = [];
    let counter = 0;

    const processBatchRequests = async (myRequests) => {
        console.log('Inside processBatchRequests');

        failed = []; // zeroing out failed requests
        // const results = [];
        for (let i = 0; i < myRequests.length; i += batchSize) {
            const batch = myRequests.slice(i, i + batchSize);
            await Promise.allSettled(batch.map(request => request.request()
                .then(response => successful.push(handleSuccess(response, request)))
                .catch(error => failed.push(handleError(error, request)))));
            // results.push(...batchResults);
            if (i + batchSize < myRequests.length) {
                await waitFunc(timeDelay);
            }
        }

        // return results;
        
        function handleSuccess(response, request) {
            return {
                id: request.id,
                status: 'fulfilled',
                value: response
            };
        }
    
        function handleError(error, request) {
            return {
                id: request.id,
                reason: error.message
            };
        }
    }
    
    do {
        if (failed.length > 0) {
            const retryRequests = failed.filter(request => !request.reason.includes('404') && !request.reason.includes('401') && !request.reason.includes('422')); // don't retry for 401, 404 or 422 errors
            myRequests = requests.filter(request => retryRequests.some(r => r.id === request.id)); // find the request data to process the failed requests
            counter++;
            await waitFunc(timeDelay); // wait for the time delay before attempting a retry
            await processBatchRequests(myRequests);
        } else {
            await processBatchRequests(myRequests); 
        }
    }
    while (counter < 3 && failed.length > 0) // loop through if there are failed requests until the counter is ove 3

    return {successful, failed};
}

    // let counter = 0;
    // const finalResults = {
    //     successful: [],
    //     failed: []
    // }

    // do {
    //     const response = await processBatchRequests(myRequests);

    //     // checking for successful requests and mapping them to a new array
    //     successful = response.filter((result) => {
    //         if (result.status === 'fulfilled') {
    //             return result;
    //         }
    //     }).map((result) => {
    //         return {
    //             status: result.status,
    //             id: result.value
    //         }
    //     });
    //     finalResults.successful.push(...successful);

    //     // checking for failed requests and mapping them to a new array
    //     failed = response.filter((result) => {
    //         if (result.status === 'rejected') {
    //             return result
    //         }
    //     }).map((result) => {
    //         const failedResult = {
    //             status: result.status,
    //             reason: result.reason.message
    //         }
    //         if (result.reason?.config?.url) {
    //             failedResult.id = result.reason.config.url.split('/').pop();
    //         }
    //         return failedResult;
    //     });
    //     finalResults.failed.push(...failed);

    //     // removing successful requests from the failed requests
    //     finalResults.successful.forEach((success) => {
    //         finalResults.failed = finalResults.failed.filter((fail) => {
    //             return fail.id != success.id;
    //         });
    //     });

    //     // filters results to attempt a retry for any which may have been throttled
    //     // const toRetry = failed.filter((fail) => {
    //     //     if (fail.reason.match(/4[0-9]{2}/)) {
    //     //         return fail;
    //     //     }
    //     // });
    //     // myRequests = toRetry;

    //     myRequests = failed;
    //     // if there are failed requests wait before retrying
    //     if (failed.length > 0) {
    //         console.log('Retring the failed requests....');
    //         await waitFunc(5000) //wait 5 seconds 
    //     }
    //     counter++;
    // } while (myRequests.length > 0 && counter < 3);

    // return finalResults;
// }
