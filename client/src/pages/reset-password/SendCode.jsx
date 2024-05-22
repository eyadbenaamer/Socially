import { useRef, useState } from "react";

import Alert from "components/alert";

import axiosClient from "utils/AxiosClient";

const SendCode = (props) => {
  const { setEmail, setIsCodeSent, email } = props;
  const [alert, setAlert] = useState({ type: "", message: "" });
  const sendBtn = useRef(null);

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
          axiosClient
            .post(`send_verification_code`, {
              type: "reset_password",
              email,
            })
            .then((response) => {
              e.target.style.background = null;
              const { message } = response.data;
              setAlert({ type: "info", message });
              setIsCodeSent(true);
            })
            .catch((error) => {
              e.target.style.background = null;
              const { message } = error.response.data;
              setAlert({ type: "error", message });
            });
        }}
      >
        Send
      </button>
    </>
  );
};

export default SendCode;
