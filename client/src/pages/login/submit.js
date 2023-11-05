import { data } from "./Form";
import axios from "axios";

const submit = async () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const response = await axios
    .post(`${API_URL}/login`, data)
    .then((response) => {
      const { status } = response;
      if (status === 200) {
        return {
          status,
          isLoggedIn: true,
          user: response.data,
          token: response.data.token,
        };
      } else {
        return {
          status,
          isLoggedIn: false,
        };
      }
    });
  const { status, user, token } = response;
  const loginDetails =
    status === 200
      ? { isLoggedIn: true, user, token }
      : status === 400
      ? { isLoggedIn: false, message: "Password or Email is missing." }
      : status === 401
      ? { isLoggedIn: false, message: "Incorrect pawssword." }
      : status === 404
      ? {
          isLoggedIn: false,
          message: "The Email is not associated with any account.",
        }
      : status === 500
      ? { isLoggedIn: false, message: "An error occured. Try again later." }
      : "";
  return loginDetails;
};

export default submit;
