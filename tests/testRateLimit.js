import axios from 'axios';

const testRateLimit = async () => {
    const url = 'http://localhost:5001/tasks';
    const headers = { Authorization: 'Bearer TU_TOKEN_AQUI' };

    for (let i = 1; i <= 110; i++) {
        try {
            const response = await axios.get(url, { headers });
            console.log(`Request ${i}: ${response.status}`);
        } catch (error) {
            console.error(`Request ${i}: ${error.response.status} - ${error.response.data.error}`);
            break;
        }
    }
};

testRateLimit();
