import { useState } from "react";

import VerifyCode from "./VerifyCode.jsx";
import SendCode from "./SendCode.jsx";
import CreateNewPassword from "./CreateNewPassword.jsx";

const ResetPassword = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");

  return (
    <div className="container center">
      {!isCodeSent && (
        <SendCode
          setIsCodeSent={setIsCodeSent}
          email={email}
          setEmail={setEmail}
        />
      )}
      {isCodeSent && !token && <VerifyCode setToken={setToken} email={email} />}
      {token && <CreateNewPassword token={token} />}
    </div>
  );
};

export default ResetPassword;
