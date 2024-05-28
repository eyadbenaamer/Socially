import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setResetPasswordInfo } from "state";

import axiosClient from "utils/AxiosClient";
import SubmitBtn from "components/SubmitBtn";
import EmailInput from "components/EmailInput";

const SendCode = () => {
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [data, setData] = useState({ email: "" });
  const dispatch = useDispatch();

  const submit = async () => {
    await axiosClient
      .post(`send_verification_code`, {
        type: "reset_password",
        email: data.email,
      })
      .then(() => {
        dispatch(
          setResetPasswordInfo({
            email: data.email,
            isCodeSent: true,
            message: "",
          })
        );
      })
      .catch((error) => {
        const { message } = error.response?.data;
        dispatch(setResetPasswordInfo({ message }));
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl primary-text">Find your account</h1>
      <h2 className="mb-6">
        Enter your email address to recieve a verification code
      </h2>
      <EmailInput
        placeholder=""
        type="reset_password"
        setIsValid={(isValid) => setIsValidEmail(isValid)}
        fieldValue={data.email}
        setData={setData}
      />
      <SubmitBtn
        disabled={!isValidEmail}
        tabIndex={1}
        onClick={async () => await submit()}
      >
        Send
      </SubmitBtn>
    </>
  );
};

export default SendCode;
