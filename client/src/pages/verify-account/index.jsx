import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Alert from "components/alert/index.jsx";
import Form from "./Form.jsx";
import { clearSessionStorage } from "state/index.js";

const VerifyAccount = () => {
  const { email, isVerified } = useSelector((state) => state.authStatus);
  const [message, setMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const theme = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();
  dispatch(clearSessionStorage());

  return (
    <>
      {/* once the account is verified, the router will redirect to the set profile page*/}
      {isVerified && <Navigate to={"/welcome"} />}
      <div className="container flex flex-col p-3">
        <div className="">
          {isAlertOpen && (
            <Alert
              isOpened={isAlertOpen}
              setIsOpened={setIsAlertOpen}
              type={"error"}
              message={message}
            />
          )}
        </div>
        <div
          className={`${
            theme === "light" ? "text-slate-800" : ""
          } my-8 bg-300 rounded-xl p-4 shadow-md self-center`}
        >
          We sent a code to : <span className="text-primary">{email}</span> to
          verify your account.
          <Form setIsAlertOpen={setIsAlertOpen} setMessage={setMessage} />
        </div>
      </div>
    </>
  );
};

export default VerifyAccount;
