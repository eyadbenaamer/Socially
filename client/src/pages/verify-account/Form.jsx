import SubmitBtn from "components/SubmitBtn";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAuthStatus, setProfile } from "state";

import axiosClient from "utils/AxiosClient";

const Form = (props) => {
  const { setMessage, setIsAlertOpen } = props;
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.authStatus);

  const sendCode = async () => {
    await axiosClient
      .post(`verify_account`, { code, email })
      .then((response) => {
        const { profile, token, isVerified } = response.data;
        localStorage.setItem("token", token);
        dispatch(setAuthStatus({ isVerified }));
        dispatch(setProfile(profile));
      })
      .catch(async (error) => {
        let { message } = error.response.data;
        if (message === "jwt expired") {
          axiosClient.post(`send_verification_code`, {
            type: "verify_account",
            email,
          });
          message = "Code has expired. we sent another code to your email";
        }
        setMessage(message);
        setIsAlertOpen(true);
        dispatch(setAuthStatus({ isVerified: false }));
      });
  };
  const sendBtn = useRef(null);
  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="border-2 my-3 rounded-lg p-2">
        <input
          className="w-20 text-xl font-bold"
          style={{ letterSpacing: 1 }}
          type="text"
          value={code}
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
        disabled={code?.length < 6}
        ref={sendBtn}
        onClick={async () => await sendCode()}
      >
        Send
      </SubmitBtn>
    </div>
  );
};

export default Form;
