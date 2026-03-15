import * as API from "@/services/API";

export default {
  getOrderById(userId, payload) {
    return API.apiClient.get(`/orders/${userId}`, payload);
  },
  getOrders(page, payload) {
    return API.apiClient.get(`/orders/?page=${page}`, payload);
  },
  updateOrder(userId, payload) {
    return API.apiClient.put(`/orders/${userId}`, payload);
  },

  deleteUser(userId) {
    return API.apiClient.delete(`/orders/${userId}`);
  },
  async enableOrder(id) {
    return await API.apiClient.post(`/orders/${id}/enable`);
  },
  async disableOrder(id) {
    return await API.apiClient.post(`/orders/${id}/disable`);
  },
};
