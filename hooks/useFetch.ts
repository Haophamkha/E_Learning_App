import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hook fetch API (async function)
export const useFetch = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch API:", error);
    throw error;
  }
};

//CRUD
export const getData = (endpoint: string) => api.get(endpoint);
export const getDataById = (endpoint: string, id: number | string) =>
  api.get(`${endpoint}/${id}`);

export const postData = (endpoint: string, data: any) =>
  api.post(endpoint, data);

export const putData = (endpoint: string, data: any) => api.put(endpoint, data);

export const patchData = (endpoint: string, data: any) =>
  api.patch(endpoint, data);

export const deleteData = (endpoint: string, id: number | string) =>
  api.delete(`${endpoint}/${id}`);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
