/*
 * This is the initial ARVIS API interface
 * we set the base URL for the ARVIS API
 */

import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";

const jarvisUrl = import.meta.env.VITE_JARVIS_URL;
const jarvisToken = import.meta.env.VITE_JARVIS_TOKEN;

export const jarvisClient = axios.create({
  baseURL: jarvisUrl,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // required to handle the CSRF token
});

jarvisClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${jarvisToken}`;
  return config;
});

/*
 * Add a response interceptor
 */
jarvisClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 503) {
      console.log("maintenance");
    }

    if (error.response && [401, 419].includes(error.response.status)) {
      console.error("User not authorized, login failed with ARVIS API");
    }

    if (error.response && error.response.status === 401) {
      console.error("User not authorized, login failed with JARVIS API");
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
