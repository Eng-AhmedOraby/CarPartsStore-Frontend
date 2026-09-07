import axiosInstance from "./axiosInstance";

export const loginAdmin = (username, password) =>
  axiosInstance.post("/auth/login", { username, password });