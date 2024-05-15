import axiosClient from "utils/AxiosClient";

const submit = async (data) => {
  const response = await axiosClient
    .post(`/login`, data)
    .then((response) => {
      const { user, isVerified } = response.data;
      return {
        isLoggedIn: true,
        user,
        isVerified,
      };
    })
    .catch((error) => {
      const { message, user, isVerified } = error.response.data;
      isVerified === false && sessionStorage.setItem("isNotVerified", true);
      return { isLoggedIn: false, message, user, isVerified };
    });
  return response;
};

export default submit;
