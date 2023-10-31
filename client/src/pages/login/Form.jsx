import { useRef, useState } from "react";
import submit from "./submit";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { Link } from "react-router-dom";

export let data = {
  email: "",
  password: "",
};

const Form = () => {
  const [stateData, setStateData] = useState(data);
  const handleChange = (e) => {
    data = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setStateData(data);
  };
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({
    isLoggedIn: null,
    message: "",
  });
  const submitButton = useRef(null);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };

  return (
    <>
      <section>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          onKeyDown={handleEnterSubmit}
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          onKeyDown={handleEnterSubmit}
        />
        <button
          ref={submitButton}
          onClick={async () => {
            let { isLoggedIn, message, user, token } = await submit();
            dispatch(setLogin({ user, token }));
            setLoginDetails({ isLoggedIn, message });
          }}
        >
          Login
        </button>
      </section>
      <div>
        Don't have an account?
        <Link to="/signup" replace={true}>
          Sign up here
        </Link>
      </div>
      {loginDetails.isLoggedIn === false && <div>{loginDetails.message}</div>}
    </>
  );
};
export default Form;
