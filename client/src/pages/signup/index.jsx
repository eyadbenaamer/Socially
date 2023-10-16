import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "state";
import Form from "./Form";
import submit from "./submit";
import { useState } from "react";
const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    isSignedUp: false,
    message: "",
  });
  return (
    <>
      <div>
        <h2>hello</h2>
        <Form />
        <button
          onClick={async () => {
            let { isSignedUp, message } = await submit();
            setSignupDetails({ isSignedUp, message });
          }}
        >
          Signup
        </button>
      </div>
      {signupDetails.isSignedUp === false && <>{signupDetails.message}</>}
      {signupDetails.isSignedUp === true && (
        <>
          {signupDetails.message} log in <Link to="login/">here</Link>
        </>
      )}
    </>
  );
};
export default Signup;
