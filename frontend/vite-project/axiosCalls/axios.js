import axios from 'axios';

const isProduction = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_URL || (isProduction ? '/api' : 'http://localhost:8081');

const axiosInstance = axios.create({
    baseURL: apiUrl.replace(/\/+$/, ''),
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    }
});

export default axiosInstance;