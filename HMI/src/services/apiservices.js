import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5500"
});

axiosInstance.defaults.timeout = 5000;

async function handleLogin(username, password) {
    return await axiosInstance.post('/login', { username, password });
}

async function handleGetProfile(headers) {
    return await axiosInstance.get('/profile', { headers });
}

async function handleRegister(username, password) {
    return await axiosInstance.post('/register', { username, password });
}

async function handleUpdatePassword(username, newPassword) {
    return await axiosInstance.put('/update-password', { username, newPassword }); // Adjusted to use PUT method and correct endpoint
}

async function validateUsername(username) {
    try {
        const response = await axiosInstance.get(`/check-username/${username}`);
        return response.data.exists; // Return true or false based on the response
    } catch (error) {
        console.error('Error validating username:', error);
        return false; // Return false if there's an error or the username doesn't exist
    }
}

export { handleGetProfile, handleLogin, handleRegister, handleUpdatePassword, validateUsername };
