import axios from "axios";
import Alert from "components/alert";
import React, { useRef, useState } from "react";

const SendCode = (props) => {
  const { setEmail, setIsCodeSent, email } = props;
  const [alert, setAlert] = useState({ type: "", message: "" });
  const sendBtn = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <>
      <div className=" md:mx-auto my-3">
        {alert.message && <Alert type={alert.type} message={alert.message} />}
      </div>
      <div> Enter your email address to recieve a verification code.</div>
      <div>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendBtn.current.click();
          }}
        />
      </div>
      <button
        ref={sendBtn}
        className="py-2 px-4 border-solid bg-primary rounded-xl text-inverse"
        onClick={(e) => {
          e.target.style.background = "#899dfc";
          axios
            .post(`${API_URL}/send_verification_code`, {
              type: "reset_password",
              email,
            })
            .then(
              (resolved) => {
                e.target.style.background = null;
                const { message } = resolved.data;
                setAlert({ type: "info", message });
                setIsCodeSent(true);
              },
              (rejected) => {
                e.target.style.background = null;
                const { message } = rejected.response.data;
                setAlert({ type: "error", message });
              }
            );
        }}
      >
        Send
      </button>
    </>
  );
};

export default SendCode;
