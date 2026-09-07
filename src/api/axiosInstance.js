import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7103/api",
  withCredentials: true,
});

export default axiosInstance;