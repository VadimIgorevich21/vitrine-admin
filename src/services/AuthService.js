import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import { apiClient } from "@/services/API";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const authClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // required to handle the CSRF token
});

/*
 * Add a response interceptor
 */
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 419].includes(error.response.status)) {
      console.info("[401, 419]: User not authorized, login failed with API");
    }

    if (error.response && [401].includes(error.response.status)) {
      console.log(error.response);
      console.log(error.response.data.message);
      notify({
        group: "auth",
        type: "error",
        duration: 10000,
        title: "Authorization",
        text: error.response.data.message,
      });
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

    if (error.response && [420].includes(error.response.status)) {
      window.location = "https://www.google.com/";
    }

    return Promise.reject(error);
  }
);

export default {
  async login(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/api/login", payload).then((response) => {
      console.log(response);
      localStorage.setItem("token", response.data.token);
    });
  },
  logout() {
    return apiClient
      .post("/logout")
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      })
      .catch((errors) => {
        console.log(errors);
      });
  },
  async forgotPassword(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/forgot-password", payload);
  },
  getAuthUser() {
    return apiClient.get("/users/auth");
  },
  async resetPassword(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/reset-password", payload);
  },
  async registerUser(payload) {
    await authClient.get("/sanctum/csrf-cookie");
    return authClient.post("/register", payload);
  },
  sendVerification(payload) {
    return authClient.post("/email/verification-notification", payload);
  },
};
