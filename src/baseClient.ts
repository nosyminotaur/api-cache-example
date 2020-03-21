import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cache } from './cacheHandler';

export const client = axios.create({ baseURL: 'http://localhost:8080/api/widget', withCredentials: true });
export const businessPrefix = '/b';
const whiteList = ['weather'];

function isURLInWhiteList(url: string) {
    return whiteList.includes(url.split('/')[1]);
}

function responseHandler(response: AxiosResponse<any>): AxiosResponse<any> {
    // eslint-disable-next-line no-constant-condition
    if (response.config.method === 'GET' || 'get') {
        if (response.config.url && !isURLInWhiteList(response.config.url)) {
            console.log('storing in cache')
            cache.store(response.config.url, JSON.stringify(response.data));
        }
    }
    return response;
}

function errorHandler(error: any) {
    if (error.headers.cached === true) {
        console.log('got cached data in response, serving it directly');
        return Promise.resolve(error);
    }
    return Promise.reject(error);
}

function requestHandler(request: AxiosRequestConfig) {
    // eslint-disable-next-line no-constant-condition
    if (request.method === 'GET' || 'get') {
        const checkIsValidResponse = cache.isValid(request.url || '');
        if (checkIsValidResponse.isValid) {
            console.log('serving cached data');
            request.headers.cached = true;
            request.data = JSON.parse(checkIsValidResponse.value || '{}');
            return Promise.reject(request);
        }
    }
    return request;
}

client.interceptors.request.use((request) => requestHandler(request));
client.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error),
);
