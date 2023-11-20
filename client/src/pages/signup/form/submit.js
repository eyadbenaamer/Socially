import axios from "axios";

const submit = async (data) => {
  const API_URL = process.env.REACT_APP_API_URL;

  return await axios.post(`${API_URL}/signup`, data).then(
    (resolved) => ({
      isSignup: true,
    }),
    (rejected) => {
      const { message } = rejected.response.data;
      return { message, isSignup: false };
    }
  );
};

export default submit;
