import { data } from "./Form";
import axios from "axios";

const submit = async () => {
  const response = await axios.post("http://localhost:3001/login", data).then(
    (resolved) => {
      const isLoggedIn = true;
      return {
        status: 200,
        isLoggedIn,
        user: resolved.data,
        token: resolved.data.token,
      };
    },
    (rejected) => {
      const isLoggedIn = false,
        status = rejected.response.status;
      return { isLoggedIn, status };
    }
  );
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
