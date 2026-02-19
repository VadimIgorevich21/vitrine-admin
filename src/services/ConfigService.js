import * as API from "@/services/API";

export default {
  getConfigs() {
    return API.apiClient.get(`/get-configs`);
  },
};
