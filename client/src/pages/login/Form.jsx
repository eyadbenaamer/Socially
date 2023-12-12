import { useRef, useState } from "react";
import submit from "./submit";
import { useDispatch } from "react-redux";
import { setAuthStatus, setUser } from "state";
import { Link, Navigate } from "react-router-dom";

const Form = () => {
  const [data, seteData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    seteData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(null);
  const submitButton = useRef(null);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  return (
    <>
      {isVerified === false && <Navigate to={"/verify-account"} />}
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
        <Link to={"/reset-password"}>Forgot password?</Link>
        <button
          ref={submitButton}
          onClick={() => {
            submit(data).then((response) => {
              let { message, user, isVerified } = response;
              !isVerified &&
                dispatch(
                  setAuthStatus({ email: data.email, message, isVerified })
                );
              isVerified &&
                dispatch(
                  setAuthStatus({
                    email: data.email,
                    isLoggedIn: true,
                    isVerified,
                  })
                );
              dispatch(setUser(user));
              setIsVerified(isVerified);
            });
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
    </>
  );
};
export default Form;
