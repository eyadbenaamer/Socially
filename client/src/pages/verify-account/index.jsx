import Alert from "components/Alert.jsx";
import { useSelector } from "react-redux";
import Form from "./Form.jsx";
import { useState } from "react";

const VerifyAccount = () => {
  const { email, message: stateMessage } = useSelector(
    (state) => state.loginStatus
  );
  const [message, setMessage] = useState(stateMessage);
  const mode = useSelector((state) => state.settings.mode);

  return (
    <div className="container center ">
      <div className=" md:mx-auto my-3">
        {message && <Alert type={"error"} message={message} />}
      </div>
      <div
        className={`${
          mode === "light" ? "text-slate-800" : ""
        } my-8 bg-300 radius p-4 shadow-sm`}
      >
        We sent a code to : {email} to verify your account.
        <div>
          <Form setMessage={setMessage} />
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
