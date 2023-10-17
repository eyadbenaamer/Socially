import Form from "./Form";
import submit from "./submit";
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
      <div>
        <h2>hello</h2>
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
