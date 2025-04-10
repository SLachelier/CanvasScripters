// quizzes.js

const axios = require('axios');
const pagination = require('./pagination.js');
const { errorCheck } = require('./utilities.js');


async function createQuiz(data) {
    let url = `https://${data.domain}/api/v1/courses/${data.course_id}/quizzes`;

    const axiosConfig = {
        method: 'post',
        url: url,
        headers: {
            'Authorization': `Bearer ${data.token}`
        },
        data: {
            "quiz": {
                "title": data.quiz_title,
                "quiz_type": data.quiz_type,
                "allowed_attempts": -1,
                "published": data.publish
            }
        }
    }

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

module.exports = {
    createQuiz
}