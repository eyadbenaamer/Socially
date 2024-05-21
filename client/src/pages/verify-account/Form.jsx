import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setAuthStatus, setToken } from "state";

import axiosClient from "utils/AxiosClient";

const Form = (props) => {
  const { setMessage } = props;
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.authStatus);
  const sendCode = async () => {
    const response = await axiosClient
      .post(`verify_account`, { code, email })
      .then((response) => {
        const { user, isVerified } = response.data;
        return {
          user,
          isVerified,
        };
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
        return { message, isVerified: false };
      });
    return response;
  };
  const sendBtn = useRef(null);
  return (
    <div>
      <div className="code my-3">
        <input
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
      <button
        ref={sendBtn}
        className="py-2 px-4 border-solid bg-primary rounded-xl text-inverse"
        onClick={(e) => {
          e.target.style.background = "#899dfc";
          sendCode().then((response) => {
            e.target.style.background = null;
            const { user, isVerified, message } = response;
            dispatch(setAuthStatus({ isVerified }));
            dispatch(setToken(user));
            setMessage(message);
          });
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Form;
