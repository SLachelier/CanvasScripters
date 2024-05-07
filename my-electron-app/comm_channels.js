// console.log('comm_channels.js');

const pagination = require('./pagination.js');
//const questionAsker = require('./questionAsker');
// const { deleteRequester } = require('./utilities');
const axios = require('axios');

const REGION = {
    "dub": "https://e5d4doray3ypvpqy7unlaoqzdi0mcwrb.lambda-url.eu-west-1.on.aws/",
    "iad_pdx": "https://r4kxi5xpiejmj2eb6ru3z2dbrq0warfd.lambda-url.us-east-1.on.aws/",
    "syd": "https://b2wfgtizt4ilrqkdqsxiphbije0rnaxl.lambda-url.ap-southeast-2.on.aws/",
    "yul": "https://4ib3vmp6bpq74pmitasw3v6wiy0etggh.lambda-url.ca-central-1.on.aws/"
}

async function emailCheck(domain, token, region, email) {
    const emailStatus = {
        suppressed: false,
        bounced: false
    };

    emailStatus.suppressed = await awsCheck(domain, token, region, email);
    emailStatus.bounced = await bounceCheck(domain, token, email);

    return emailStatus;
}

async function awsCheck(domain, token, region, email) {
    const headers = {
        "Authorization": `Bearer ${token}`
    }

    const config = {
        headers: headers
    }

}
async function bounceCheck(domain, token, email) {
    const headers = {
        "Authorization": `Bearer ${token}`
    }

    const config = {
        headers: headers
    }

    let bounceURL = `${domain}/api/v1/bounced_communication_channels?pattern=${email}`;

    // create a try block to catch errors and return false
    try {
        const result = await axios.get(bounceURL, config);

        if (result.length > 1) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = {
    emailCheck
}