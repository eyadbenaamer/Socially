import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({ baseURL: API_URL });

axiosClient.interceptors.request.use((config) => {
  const { user } = JSON.parse(localStorage.getItem("persist:root"));
  let { token } = JSON.parse(user);
  token = token?.replaceAll('"', "");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
