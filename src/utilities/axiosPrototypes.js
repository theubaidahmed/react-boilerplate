import axios from 'axios';
import { getCookie } from './cookies';
import { env } from './function';

const accessToken = getCookie('accessToken');

const authServer = axios.create({
    baseURL: env('AUTHENTICATION_SERVER'),
    withCredentials: false,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});

const filesServer = axios.create({
    baseURL: env('FILES_SERVER'),
    withCredentials: false,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});

export { authServer, filesServer };
