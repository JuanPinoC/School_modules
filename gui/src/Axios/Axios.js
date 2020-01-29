import axios from 'axios';

const API = axios.create({
	baseURL: 'http://192.168.0.1:3001/'
});

export default API;