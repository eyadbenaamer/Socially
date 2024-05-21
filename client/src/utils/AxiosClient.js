import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({ baseURL: API_URL });

axiosClient.interceptors.request.use((config) => {
  let { token } = JSON.parse(localStorage.getItem("persist:root"));
  token = token?.replaceAll('"', "");

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
