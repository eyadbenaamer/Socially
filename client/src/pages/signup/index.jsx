import Form from "./form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsVerified } from "state";
const Signup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  dispatch(setIsVerified(false));
  return (
    <>
      <h2>hello</h2>
      {!isSignup && <Form setIsSignup={setIsSignup} />}
      {isSignup && <Navigate to={"/verify-account"} />}
    </>
  );
};
export default Signup;
