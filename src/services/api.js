import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.5:3001/',
});
// http://10.0.2.2:3001/
export default api;