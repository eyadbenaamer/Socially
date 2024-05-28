import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import VerifyCode from "./VerifyCode.jsx";
import SendCode from "./SendCode.jsx";
import CreateNewPassword from "./CreateNewPassword.jsx";
import Alert from "components/alert/index.jsx";

import { setResetPasswordInfo } from "state/index.js";
import axiosClient from "utils/AxiosClient.js";

const ResetPassword = () => {
  const { isCodeSent, token, message } = useSelector(
    (state) => state.resetPasswordInfo
  );
  const [alert, setAlert] = useState({ type: "", isOpen: false });
  const setIsAlertOpen = (isOpen) => setAlert((prev) => ({ ...prev, isOpen }));
  const theme = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();
  const { token: tokenParam } = useParams();

  /*
  password reset can also be performed by a token rather than a verification code
  if the token is exist, the request the endpoint by this token and this endpoint
  returns the token that entitles the user to reset the password, otherwise the user have 
  to reset the password by the verification code that was sent to their email.
  */
  useEffect(() => {
    if (tokenParam) {
      axiosClient(`verify_reset_password?token=${tokenParam}`)
        .then((resposnse) => {
          const { token } = resposnse.data;
          dispatch(setResetPasswordInfo({ token, isCodeSent: true }));
        })
        .catch((error) => {
          const { message } = error.response?.data;
          dispatch(setResetPasswordInfo({ message }));
        });
    }
  }, []);

  useEffect(() => {
    if (!alert.isOpen) {
      // reset message when alert is closed
      dispatch(setResetPasswordInfo({ message: "" }));
    }
  }, [alert.isOpen]);

  useEffect(() => {
    if (message) {
      // open the alert when message is set
      setAlert((prev) => ({ ...prev, isOpen: true }));
    } else {
      setAlert((prev) => ({ ...prev, isOpen: false }));
    }
  }, [message]);

  return (
    <div className="container flex flex-col p-3">
      <Alert
        isOpened={alert.isOpen}
        setIsOpened={setIsAlertOpen}
        type={"error"}
        message={message}
      />

      <div
        className={`${
          theme === "light" ? "text-slate-800" : ""
        } my-8 bg-300 rounded-xl p-4 shadow-md flex flex-col gap-2 self-center`}
      >
        {!isCodeSent && <SendCode />}
        {isCodeSent && !token && <VerifyCode />}
        {token && <CreateNewPassword />}
      </div>
    </div>
  );
};

export default ResetPassword;
