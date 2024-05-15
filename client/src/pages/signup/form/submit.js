import axiosClient from "utils/AxiosClient";

const submit = async (data) => {
  return await axiosClient
    .post(`signup`, data)
    .then(() => {
      return { isSignup: true };
    })
    .catch((error) => {
      const { message } = error.response.data;
      return { message, isSignup: false };
    });
};

export default submit;
