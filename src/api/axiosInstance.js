import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://car-storem.runasp.net/api",
  withCredentials: true,
});

export default axiosInstance; 