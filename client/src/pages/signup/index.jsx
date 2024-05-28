import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import Form from "./form";
import { setResetPasswordInfo } from "state";

const Signup = () => {
  const [isSignedup, setIsSignedup] = useState(false);
  const theme = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();

  // clear stored fields in reset page
  dispatch(setResetPasswordInfo(null));

  return (
    <>
      {isSignedup && <Navigate to={"/verify-account"} />}
      <div className="container m-auto">
        <div
          className={`auth flex flex-col gap-3 w-fit my-5 mx-auto shadow-md rounded-xl p-4 bg-300 ${
            theme === "light" ? "border" : ""
          }`}
        >
          <h2 className="text-2xl">Sign up</h2>
          <Form setIsSignup={setIsSignedup} />
          <div>
            Already have an account?{" "}
            <Link
              tabIndex={1}
              to="/login"
              className=" hover:underline hover:text-[var(--primary-color)]"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Signup;
