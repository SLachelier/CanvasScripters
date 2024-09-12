// console.log('comm_channels.js');

const pagination = require('./pagination.js');
//const questionAsker = require('./questionAsker');
// const { deleteRequester } = require('./utilities');
const axios = require('axios');
const { waitFunc, errorCheck } = require('./utilities.js');

const REGION = {
    "dub_fra": "https://e5d4doray3ypvpqy7unlaoqzdi0mcwrb.lambda-url.eu-west-1.on.aws/emails/",
    "iad_pdx": "https://r4kxi5xpiejmj2eb6ru3z2dbrq0warfd.lambda-url.us-east-1.on.aws/emails/",
    "syd_sin": "https://b2wfgtizt4ilrqkdqsxiphbije0rnaxl.lambda-url.ap-southeast-2.on.aws/emails/",
    "yul": "https://4ib3vmp6bpq74pmitasw3v6wiy0etggh.lambda-url.ca-central-1.on.aws/emails/"
}

async function emailCheck(data) {
    const domain = data.domain;
    const token = data.token;
    const region = REGION[data.region];
    const email = data.pattern;

    const emailStatus = {
        suppressed: false,
        bounced: false
    };

    emailStatus.suppressed = await awsCheck(region, token, email);
    emailStatus.bounced = await bounceCheck(domain, token, email);

    return emailStatus;
}

async function awsCheck(domain, token, email) {
    console.log('awsCheck');

    const axiosConfig = {
        method: 'get',
        url: `${domain}${encodeURIComponent(email)}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const request = async () => {
            return await axios(axiosConfig);
        }

        const response = await errorCheck(request);
        return response;
    } catch (error) {
        if (error.status.match(/404/)) {
            return false;
        }
        throw error;
    }
}

async function bounceCheck(domain, token, email) {
    console.log('bounceCheck');

    const url = `https://${domain}/api/v1/accounts/self/bounced_communication_channels?pattern=${email}`;

    const axiosConfig = {
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const request = async () => {
            return await axios(axiosConfig);
        }

        const response = await errorCheck(request);
        return response.data.length > 1;
    } catch (error) {
        throw error;
    }

    // let bounceURL = `${domain}/api/v1/bounced_communication_channels?pattern=${email}`;

    // // create a try block to catch errors and return false
    // try {
    //     const result = await axios.get(bounceURL, config);

    //     if (result.length > 1) {
    //         return true;
    //     }
    //     return false;
    // } catch (error) {
    //     console.error(error);
    //     return false;
    // }
}

async function checkCommDomain(data) {
    console.log('checking domains...');

    let suppList = [];
    let url = `${REGION[data.region]}domain/${encodeURIComponent(data.pattern)}`;
    let next = url;
    let retryCounter = 1;

    const axiosConfig = {
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/x-www.form-urlencoded'
        }
    };

    // looping through the list while there is a next_token
    while (next) {
        console.log('searching...');
        console.log(next);
        try {
            const request = async () => {
                return await axios(axiosConfig);
            };

            const response = await errorCheck(request);
            if (response.status === 502) {
                if (retryCounter > 3) {
                    console.log('Retry has failed more than 4 times. Returning found emails and exiting.');
                    break;
                } else {
                    console.log(retryCounter);
                    retryCounter++;
                    console.log('Retrying in 1 minute.');
                    await waitFunc(60000);
                }
            } else if (response.status !== 200) {

            } else {
                retryCounter = 1;
                data = response.data;

                for (let item of data.suppressed) {
                    suppList.push(item.email);
                }
                if (!data.next_token) {
                    next = false;
                    console.log('end of list');
                } else {
                    next = `${url}?next_token=${encodeURIComponent(data.next_token)}`;
                    axiosConfig.url = next;
                }
            }
        } catch (error) {
            console.log('There was an error: ', error)
            throw error;
        }
    }
    return suppList;
}

module.exports = {
    emailCheck, checkCommDomain
}