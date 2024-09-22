// courses.js

const axios = require('axios');
const pagination = require('./pagination.js');
const { errorCheck } = require('./utilities.js');

async function resetCourse(data) {
    console.log('inside resetCourse');

    let url = `https://${data.domain}/api/v1/courses/${data.course}/reset_content`;

    try {
        const request = async () => {
            return await axios.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + data.token
                }
            });
        };

        const response = await errorCheck(request);
        return response.data.id;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    resetCourse
};