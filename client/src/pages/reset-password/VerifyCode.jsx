import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SubmitBtn from "components/SubmitBtn";

import { setResetPasswordInfo } from "state";
import axiosClient from "utils/AxiosClient";

const VerifyCode = () => {
  const { email } = useSelector((state) => state.resetPasswordInfo);
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const verifyCode = async () => {
    await axiosClient
      .post(`verify_reset_password`, { code, email })
      .then((response) => {
        const { token } = response.data;
        dispatch(setResetPasswordInfo({ token, message: "" }));
      })
      .catch(async (error) => {
        let { message } = error.response.data;
        if (message === "jwt expired") {
          axiosClient.post(`send_verification_code`, {
            type: "reset_password",
            email,
          });
          message = "Code has expired. we sent another code to your email";
        }
        dispatch(setResetPasswordInfo({ message }));
      });
  };
  const sendBtn = useRef(null);

  const resendCode = async () => {
    setResending(true);
    setResent(false);
    try {
      await axiosClient.post(`send_verification_code`, {
        type: "reset_password",
        email: email,
      });
      setResent(true);
    } catch (e) {}
    setResending(false);
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-md mx-auto rounded-xl p-4 mt-8">
      <h2 className="text-2xl text-center font-bold mb-2 text-primary">
        Verify Your Account
      </h2>
      <p className="text-center mb-4 text-sm">
        Enter the 6-digit code sent to{" "}
        <span className="font-semibold">{email}</span> to verify your account.
      </p>
      <div className="border-2 border-blue-200 focus-within:border-blue-500 transition rounded-lg p-2 mb-2 flex justify-center">
        <input
          className="w-32 text-2xl font-mono font-bold text-center bg-transparent outline-none tracking-widest"
          maxLength={6}
          type="text"
          value={code}
          placeholder="------"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendBtn.current.click();
            }
          }}
          onChange={(e) => {
            let codeArray = e.target.value.match(/[0-9]/g);
            let code = "";
            codeArray &&
              codeArray.map((digit) =>
                code.length < 6 ? (code += digit) : ""
              );
            setCode(code);
          }}
        />
      </div>
      <SubmitBtn
        disabled={code?.length < 6 || loading}
        ref={sendBtn}
        onClick={async () => await verifyCode()}
      >
        {loading ? "Verifying..." : "Verify"}
      </SubmitBtn>
      <div className="flex flex-col gap-2 items-center mt-4 w-full">
        <button
          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          onClick={resendCode}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend Code"}
        </button>
        {resent && (
          <span className="text-green-600 text-xs mt-1">
            A new code was sent!
          </span>
        )}
        <span className="text-gray-400 text-xs mt-2">
          Code expires in 10 minutes.
        </span>
      </div>
    </div>
  );
};

export default VerifyCode;
