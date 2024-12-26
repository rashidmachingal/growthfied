import axios from "axios";
import Cookies from "universal-cookie";
import { BACKEND_URL } from "../../config";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const cookies = new Cookies()

  axiosInstance.interceptors.request.use(request => {
    if (typeof window !== 'undefined') {
       const token = cookies.get('token');
       if (token) {
          request.headers = request.headers || {};
          request.headers.Authorization = `Bearer ${token}`;
       }
    }
    return request;
 });

  const setAuthorization= (token: string | false) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  export { axiosInstance, setAuthorization };