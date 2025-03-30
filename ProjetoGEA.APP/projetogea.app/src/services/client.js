import axios from 'axios';

export const HTTPClient = axios.create({
    baseURL: 'http://localhost:5131',
    withCredentials: true,
    headers: {        
        'Content-Type': 'application/json; charset=utf-8',
    }
});