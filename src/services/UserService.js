import * as API from "@/services/API";

export default {
  getUser(userId) {
    return API.apiClient.get(`/user/${userId}`);
  },
  getUserById(userId, payload) {
    return API.apiClient.get(`/users/${userId}`, payload);
  },
  getUsers(page, payload) {
    return API.apiClient.get(`/users/?page=${page}`, payload);
  },
  getTelegramClientUsers(page, payload) {
    return API.apiClient.get(`/telegram-clients-list/?page=${page}`, payload);
  },
  addCustomerUsers(customerId, payload) {
    return API.apiClient.post(`/customers/${customerId}/add-users`, payload);
  },
  deleteCustomerUser(customerId, userId, payload) {
    return API.apiClient.delete(
      `/customers/${customerId}/users/${userId}`,
      payload
    );
  },
  paginateUsers(link) {
    return API.apiClient.get(link);
  },
  updateUser(userId, payload) {
    return API.apiClient.put(`/user/${userId}`, payload);
  },
  updatePassword(payload) {
    return API.apiClient.put("/user/password", payload);
  },
  deleteUser(userId) {
    return API.apiClient.delete(`/users/${userId}`);
  },
};
