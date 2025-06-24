import { useState } from "react";
import { useDispatch } from "react-redux";

import { setResetPasswordInfo } from "state";

import axiosClient from "utils/AxiosClient";
import SubmitBtn from "components/SubmitBtn";
import EmailInput from "components/EmailInput";

const SendCode = () => {
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [data, setData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const submit = async () => {
    setLoading(true);

    // Clear any existing reset password state before starting new process
    dispatch(
      setResetPasswordInfo({
        email: null,
        token: null,
        message: "",
        isCodeSent: false,
        isPasswordReset: false,
      })
    );

    try {
      await axiosClient.post(`send_verification_code`, {
        type: "reset_password",
        email: data.email,
      });

      dispatch(
        setResetPasswordInfo({
          email: data.email,
          isCodeSent: true,
          message: "",
        })
      );
    } catch (error) {
      const { message } = error.response?.data || {};
      dispatch(setResetPasswordInfo({ message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-primary">Find your account</h1>
      <h2 className="mb-6">
        Enter your email address to receive a verification code
      </h2>
      <EmailInput
        placeholder=""
        type="reset_password"
        setIsValid={(isValid) => setIsValidEmail(isValid)}
        fieldValue={data.email}
        setData={setData}
      />
      <SubmitBtn
        disabled={!isValidEmail || loading}
        tabIndex={1}
        onClick={submit}
      >
        {loading ? "Sending..." : "Send"}
      </SubmitBtn>
    </>
  );
};

export default SendCode;
