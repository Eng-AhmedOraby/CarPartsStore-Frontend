import axiosInstance from "./axiosInstance";

export const loginAdmin = (username, password) =>
  axiosInstance.post("/auth/login", { username, password });

export const changePassword = (data) => 
  axiosInstance.post("/auth/change-password", data);