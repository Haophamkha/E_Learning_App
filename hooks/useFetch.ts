import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const getData = async (endpoint: string) => {
  const res = await api.get(endpoint);
  return res.data;
};

export const postData = async (endpoint: string, data: any) => {
  const res = await api.post(endpoint, data);
  return res.data;
};

export const putData = async (endpoint: string, data: any) => {
  const res = await api.put(endpoint, data);
  return res.data;
};

export const patchData = async (endpoint: string, data: any) => {
  const res = await api.patch(endpoint, data);
  return res.data;
};

export const deleteData = async (endpoint: string) => {
  const res = await api.delete(endpoint);
  return res.data;
};

export default api;
