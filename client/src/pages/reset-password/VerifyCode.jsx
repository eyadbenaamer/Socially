import axios from "axios";
import Alert from "components/Alert";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus, setUser } from "state";

const VerifyCode = (props) => {
  const { email, setToken } = props;
  const [code, setCode] = useState("");
  const theme = useSelector((state) => state.settings.theme);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const sendCode = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const response = await axios
      .post(`${API_URL}/reset_password/verify_code`, { code, email })
      .then(
        (resolved) => {
          const { token } = resolved.data;
          return { token };
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
          return { alert: { type: "error", message } };
        }
      );
    return response;
  };
  const sendBtn = useRef(null);

  return (
    <>
      <div className=" md:mx-auto my-3">
        {alert.message && <Alert type={alert.type} message={alert.message} />}
      </div>
      <div
        className={`${
          theme === "light" ? "text-slate-800" : ""
        } my-8 bg-300 rounded-xl p-4 shadow-md`}
      >
        Enter the code that has been sent to your email address
        <div className=" my-3">
          <input
            className="rounded-xl border-2 text-center text-3xl h-[60px] w-[120px]"
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
              const { alert, token } = response;
              setAlert(alert);
              setToken(token);
            });
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default VerifyCode;
