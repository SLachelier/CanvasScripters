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

async function createSupportCourse(data) {
    console.log('inside createSupportCourse');

    let url = `${data.domain}/api/v1/accounts/self/courses`;

    const courseData = {
        course: {
            name: data.course.name,
            default_view: 'feed'
        },
        offer: data.course.publish
    }

    const axiosConfig = {
        method: 'post',
        url: url,
        headers: {
            'Authorization': `Bearer ${data.token}`
        },
        data: courseData
    };

    try {
        const request = async () => {
            return await axios(axiosConfig);
        }
        const response = await errorCheck(request);
        return response.data;
    } catch (error) {
        throw error
    }
}

async function editCourse(data) {
    let url = `${data.domain}/api/v1/courses/${data.course_id}`;

    const courseData = {
        course: {
            blueprint: true
        }
    }

    const axiosConfig = {
        method: 'put',
        url: url,
        headers: {
            'Authorization': `Bearer ${data.token}`
        },
        data: courseData
    };

    try {
        const request = async () => {
            return await axios(axiosConfig);
        }
        const response = await errorCheck(request);
        return response.data;
    } catch (error) {
        throw error
    } finally {
        console.log('Finished editing course');
    }
}

module.exports = {
    resetCourse, createSupportCourse, editCourse
};