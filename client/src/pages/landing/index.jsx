import Navbar from "./Navbar.jsx";
import Form from "../login/Form";
import submit from "../login/submit";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
const Login = () => {
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({
    isLoggedIn: false,
    message: "",
  });
  return (
    <>
      <Navbar/>
      <div className="container m-auto my-8">
        <h1 style={{fontSize:32}}>Welcome to Socially!  </h1>
        <Form />
        <button
          onClick={async () => {
            let { isLoggedIn, message, user, token } = await submit();
            dispatch(setLogin({ user, token }));
            setLoginDetails({ isLoggedIn, message });
          }}
        >
          Login
        </button>
      </div>
      {loginDetails.isLoggedIn === false && <>{loginDetails.message}</>}
    </>
  );
};
export default Login;
