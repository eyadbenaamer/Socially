import axios from "axios";

const submit = async (data) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const response = await axios.post(`${API_URL}/login`, data).then(
    (resolved) => {
      const { user, isVerified } = resolved.data;
      return {
        isLoggedIn: true,
        user,
        isVerified,
      };
    },
    (rejected) => {
      const { message, user, isVerified } = rejected.response.data;
      isVerified === false && sessionStorage.setItem("isNotVerified", true);
      return { isLoggedIn: false, message, user, isVerified };
    }
  );
  return response;
};

export default submit;
