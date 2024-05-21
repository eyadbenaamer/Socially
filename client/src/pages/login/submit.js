import axiosClient from "utils/AxiosClient";

const submit = async (data) => {
  const response = await axiosClient
    .post(`/login`, data)
    .then((response) => {
      const { token, profile, isVerified } = response.data;
      return {
        isLoggedIn: true,
        token,
        profile,
        isVerified,
      };
    })
    .catch((error) => {
      const { message, token, isVerified } = error.response.data;
      isVerified === false && sessionStorage.setItem("isNotVerified", true);
      return { isLoggedIn: false, message, token, isVerified };
    });
  return response;
};

export default submit;
