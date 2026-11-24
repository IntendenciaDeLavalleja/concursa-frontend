import axios from 'axios';

const backendOrigin = import.meta.env.VITE_BACKEND_URL;
const apiPath = '/api';

export const api = axios.create({
  baseURL: backendOrigin ? new URL(apiPath, backendOrigin).href : apiPath,
  timeout: 15000,
});

export function apiResourceUrl(url: string): string {
  return backendOrigin && url.startsWith(`${apiPath}/`) ? new URL(url, backendOrigin).href : url;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limited. Please try again later.');
    }
    return Promise.reject(error);
  }
);
