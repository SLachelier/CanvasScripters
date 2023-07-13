// utilities.js
// const { instance, getMyRegion } = require('./Canvas/config');

const axios = require('axios');
// add utilities here

async function createRequester(method, url, params, num, endpoint) {
    let index = 1;
    let apiLimit = 35
    let waitTime = 2000;
    let loops = Math.floor(num / apiLimit);
    let requests = [];
    let newParams = params;
    let arrayOfResults = [];
    let results = [];

    // loops is the number of item / 40 to add to a Promise.all()
    // I use / 40 to make sure I don't get rate limited when doing 
    // all the requests in parallel
    while (loops > 0) {
        console.log('Inside while');
        for (let i = 0; i < apiLimit; i++) {
            console.log('adding requests to promise');
            newParams[endpoint].name = `${endpoint} ${index}`;
            // console.log(`The position is ${params[endpoint].position}`);
            // if (params[endpoint].position) {
            //     newParams[endpoint].position = index;
            // }
            // console.log(`The index is ${ index }, the id is ${ discussionList[index].id }`);
            try {
                requests.push(axios({
                    method: method,
                    url: url,
                    data: newParams
                }));
            } catch (error) {
                console.log(`error adding request ${i} url ${url} to array`);
            }
            index++;
        }
        console.log('Finished adding requests');
        try {
            results = await Promise.all(requests);
            console.log('Processed requests');
            arrayOfResults.push(...results.map((result) => {
                return result.data;
            }));
        } catch (error) {
            console.log('There was an error', error.message, error.url);
            return;
        }
        console.log('Processed requests');
        // after processing the requests wait for 2 seconds to all the 
        // api rate limit to calm down before doing any more requests
        holdPlease(waitTime);
        // reset the requests array and lower loop value by 1
        requests = [];
        loops--;
    }
    console.log('Outside while');
    // after doing all mulitple of 40 finishe the remainder of the requests
    for (let i = 0; i < num % apiLimit; i++) {
        console.log('adding requests to promise');
        newParams[endpoint].name = `${endpoint} ${index}`;

        //****************************
        // Had to remove position because it was causing deadlocks on creation
        //***************************

        // if (params[endpoint].position) {
        //     console.log('Updating position');
        //     newParams[endpoint].position = index;
        //     console.log(newParams[endpoint].position);
        // }
        try {
            requests.push(axios({
                method: method,
                url: url,
                data: newParams
            }));
        } catch (error) {
            console.log(`error adding request ${i} url ${url} to array`);
        }
        index++;
    }
    console.log('Finished adding requests');
    try {
        results = await Promise.all(requests);
        console.log('Finished processing requests');
        arrayOfResults.push(...results.map((result) => {
            return result.data;
        }));
    } catch (error) {
        console.log('There was an error', error.message, error.url, error);
        return;
    }
    return arrayOfResults;
}

async function deleteRequester(content, baseURL, afterID = null) {
    // content = array of conversations
    // baseURL = /converations
    let apiLimit = 35;
    let waitTime = 2000;
    let loops = Math.floor(content.length / apiLimit);
    let requests = [];
    let index = 0;


    while (loops > 0) {
        for (let i = 0; i < apiLimit; i++) {
            let myURL = `${baseURL}/${content[index].id}`;
            if (afterID !== null)
                myURL += `/${afterID}`;

            requests.push(axios({
                method: 'delete',
                url: myURL
            }));
            index++;
        }
        await Promise.all(requests);
        console.log('Processed requests');
        holdPlease(waitTime);
        requests = [];
        loops--;
    }
    for (let i = 0; i < content.length % apiLimit; i++) {
        let myURL = `${baseURL}/${content[index].id}`;
        if (afterID !== null)
            myURL += `/${afterID}`;

        requests.push(axios({
            method: 'delete',
            url: myURL
        }));
        index++;
    }
    await Promise.all(requests);
    console.log('Processing last requests');
}

function holdPlease(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getRegion() {
    const response = await axios({
        method: "GET",
        url: `/accounts/self`
    });
    if (!response.headers.get('x-canvas-meta')) {
        console.log(response.headers);
        console.log('Unable to find region');
        return false;
    }
    const region = response.headers.get('x-canvas-meta').match(/z=(\w+)/)[1];
    console.log(region);

    return getMyRegion(region);
}

module.exports = {
    createRequester, deleteRequester, holdPlease, getRegion
};
