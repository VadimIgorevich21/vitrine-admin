/*
 * This is the initial API interface
 * we set the base URL for the API
 */

import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const apiClient = axios.create({
  baseURL: apiUrl + "/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // required to handle the CSRF token
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

/*
 * Add a response interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 503) {
      console.log("maintenance");
      router.push("/maintenance");
    }

    if (error.response && [401, 419].includes(error.response.status)) {
      console.error("User not authorized, login failed with API");
    }

    if (error.response && error.response.status === 401) {
      const isLoginPage = window.location.pathname.includes("login");
      if (localStorage.getItem("user") && !isLoginPage) {
        router.push({ name: "Login" });
      }
      localStorage.removeItem("configs");
      localStorage.removeItem("user");
      console.error("User not authorized, login failed with API");
    }

    if (error.response && [403].includes(error.response.status)) {
      notify({
        group: "auth",
        type: "error",
        duration: 10000,
        title: "Authorization",
        text: error.response.data.message,
      });
    }

    if (error.response && [422, 429].includes(error.response.status)) {
      notify({
        group: "auth",
        type: "error",
        duration: 10000,
        title: "Authorization",
        text: error.response.data.message,
      });
    }

    if (error.response && [420].includes(error.response.status)) {
      window.location = "https://www.google.com/";
    }

    return Promise.reject(error);
  }
);
