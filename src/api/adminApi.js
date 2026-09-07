import axiosInstance from "./axiosInstance";

export const createProduct = (data) => axiosInstance.post("/products", data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/upload/product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const addProductImage = (productId, imageUrl) =>
  axiosInstance.post(`/products/${productId}/images`, { imageUrl });

export const removeProductImage = (productId, imageId) =>
  axiosInstance.delete(`/products/${productId}/images/${imageId}`);

export const createCategory = (data) => axiosInstance.post("/categories", data);

export const updateStoreSettings = (data) => axiosInstance.put("/storesettings", data);