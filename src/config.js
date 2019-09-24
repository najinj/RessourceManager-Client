import axios from "axios";
import dotenv from "dotenv";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
dotenv.config();

// const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "https://localhost:44397/api/", // process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
    // Authorization: `Bearer ${token}`
  }
});

axiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log("axiosInstance");
    // Do something with response data
    return response;
  },
  error => {
    switch (error.response.status) {
      case 401:
        // unauthorized -> token is invalid or expired
        // User must reconnect!
        // store.dispatch(logout());
        // history.push("/login");
        break;
      default:
        break;
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
