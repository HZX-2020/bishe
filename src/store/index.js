import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      token: "",
      userType: null,
      user: null,
    };
  },
  getters: {
    getUserType() {
      return this.userType || localStorage.getItem("userType");
    },
    getUser() {
      return this.user || JSON.parse(localStorage.getItem("user"));
    },
    getToken() {
      return this.token || localStorage.getItem("token");
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUserType(userType) {
      this.userType = userType;
    },
    setUser(user) {
      this.user = user;
    },
  },
});
