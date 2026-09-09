import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Access token lives only in memory.
let accessToken: string | null = null;

export const setApiAccessToken = (
  token: string | null
) => {
  accessToken = token;
};

export const getApiAccessToken = () => {
  return accessToken;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;