import { AuthContext } from "App";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import state, { setAuthStatus, setUser } from "state";

const Form = (props) => {
  const { setMessage } = props;
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.authStatus);
  const sendCode = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await axios
      .post(`${API_URL}/verify_account`, { code, email })
      .then(
        (resolved) => {
          const { user, isVerified } = resolved.data;
          return {
            user,
            isVerified,
          };
        },
        async (rejected) => {
          let { message } = rejected.response.data;
          if (message === "jwt expired") {
            axios.post(`${API_URL}/send_verification_code`, {
              type: "verify_account",
              email,
            });
            message = "Code has expired. we sent another code to your email";
          }
          return { message, isVerified: false };
        }
      );
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
        className="py-2 px-4 border-solid bg-primary radius text-inverse"
        onClick={(e) => {
          e.target.style.background = "#899dfc";
          sendCode().then((response) => {
            e.target.style.background = null;
            const { user, isVerified, message } = response;
            dispatch(setAuthStatus({ isVerified }));
            dispatch(setUser(user));
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
