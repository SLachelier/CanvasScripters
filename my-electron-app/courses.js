// courses.js

const axios = require('axios');
const pagination = require('./pagination.js');

async function resetCourse(baseURL, courseID, token) {
    console.log('inside resetCourse');

    let url = baseURL + '/api/v1/courses/' + courseID + '/reset_content';

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.status === 200) {
            return 'success';
        } else {
            return 'failed';
        }
    } catch (error) {
        console.error('Error in resetCourse', error);
        return 'failed';
    }
}

module.exports = {
    resetCourse
};