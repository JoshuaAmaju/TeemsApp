import {url} from '@env';
import {service} from '@stores/user';
import type {AxiosError} from 'axios';
import axios from 'axios';

export const http = axios.create({baseURL: url});

http.interceptors.request.use(request => {
  const {token} = service.getSnapshot().context;
  (request.headers as any).Authorization = `Token ${token}`;
  return request;
});

http.interceptors.response.use(
  response => response.data,
  error => {
    // const originalRequest = error.config;
    // const { status } = error.response ?? {}

    const err = (error as AxiosError).response?.data ?? (error as Error);

    // console.log('http error', originalRequest?.url, error.response?.data);

    return Promise.reject(err);
  },
);
