import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAuthStatus, setProfile, setResetPasswordInfo } from "state";

import PasswordInput from "components/PasswordInput";
import SubmitBtn from "components/SubmitBtn";

import axiosClient from "utils/AxiosClient";
import { Link } from "react-router-dom";

const CreateNewPassword = () => {
  const { token, isPasswordReset } = useSelector(
    (state) => state.resetPasswordInfo
  );
  const [isValidInputs, setIsValidInputs] = useState({
    password: false,
    confirmPassword: false,
  });
  const [data, setData] = useState({ password: "" });
  const dispatch = useDispatch();
  const [authInfo, setAuthInfo] = useState({});

  const isDisabled = () => {
    for (const key in isValidInputs) {
      if (!isValidInputs[key]) {
        return true;
      }
    }
    return false;
  };

  const resetPassword = async () => {
    return await axiosClient
      .post(`reset_password/${token}`, { password: data.password })
      .then((response) => {
        setAuthInfo(response.data);
        dispatch(setResetPasswordInfo({ isPasswordReset: true }));
      })
      .catch((error) => {
        const { message, isExpired } = error.response.data;
        if (isExpired) {
          /*
          if token is expired then all reset password information will be reset
          which will redirect back to searh account wizard
          */
          dispatch(
            setResetPasswordInfo({ isCodeSent: false, token: null, message })
          );
        }
        dispatch(setResetPasswordInfo({ message }));
      });
  };

  const authenticateAfterReset = () => {
    const { profile, isVerified, token } = authInfo;
    localStorage.setItem("token", token);
    dispatch(setAuthStatus({ isVerified, email: "", isLoggedin: true }));
    dispatch(setProfile(profile));
    dispatch(setResetPasswordInfo(null));
  };
  return (
    <>
      {!isPasswordReset && (
        <>
          <h1 className="font-bold text-2xl primary-text">
            Enter new password
          </h1>
          <PasswordInput
            setIsValid={(isValid) =>
              setIsValidInputs({ ...isValidInputs, password: isValid })
            }
            data={data}
            setData={setData}
            name={"password"}
            fieldValue={data.password}
            placeholder={"New password"}
          />
          <PasswordInput
            setIsValid={(isValid) =>
              setIsValidInputs({ ...isValidInputs, confirmPassword: isValid })
            }
            data={data}
            setData={setData}
            name={"confirmPassword"}
            fieldValue={data.confirmPassword}
            placeholder={"Confirm new password"}
          />
          <SubmitBtn
            disabled={isDisabled()}
            tabIndex={1}
            onClick={async () => await resetPassword()}
          >
            Send
          </SubmitBtn>
        </>
      )}
      {isPasswordReset && (
        <div className="flex flex-col gap-6">
          <h1 className="text-lg">
            Your password has been reset successfully!
          </h1>
          <Link
            className="w-full rounded-xl bg-primary p-2 text-center"
            to="/"
            onClick={authenticateAfterReset}
          >
            Go to home page
          </Link>
        </div>
      )}
    </>
  );
};

export default CreateNewPassword;
