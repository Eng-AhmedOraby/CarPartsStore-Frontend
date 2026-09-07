import axiosInstance from "./axiosInstance";

export const getProducts = (categoryId, page = 1) =>
  axiosInstance.get("/products", { params: { categoryId, page, pageSize: 12 } });

export const getProductById = (id) =>
  axiosInstance.get(`/products/${id}`);

export const getCategories = () =>
  axiosInstance.get("/categories");

export const getStoreSettings = () =>
  axiosInstance.get("/storesettings");