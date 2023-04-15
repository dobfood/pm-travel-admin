import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');

  if (token) {
    config.headers = {
      token: `${token}`,
    };
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default http;
