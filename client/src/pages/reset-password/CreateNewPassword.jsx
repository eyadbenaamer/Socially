import { useState } from "react";
import { useDispatch } from "react-redux";

import Alert from "components/alert";

import { setToken } from "state";

import axiosClient from "utils/AxiosClient";

const CreateNewPassword = ({ token }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState(null);
  const dispatch = useDispatch();

  const resetPassword = async () => {
    return await axiosClient.post(`reset_password/${token}`, { password }).then(
      (response) => {
        const { user, isVerified } = response.data;
        dispatch(setToken({ user, isVerified }));
      },
      (rejected) => {
        const { message } = rejected.response.data;
        setAlert({ type: "error", message });
      }
    );
  };

  return (
    <>
      <div className=" md:mx-auto my-3">
        {alert.message && <Alert type={alert.type} message={alert.message} />}
      </div>
      <div>Enter new password</div>
      <div>
        New password:
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        Confirm new password:
        <input
          type="text"
          onChange={(e) => {
            if (e.target.value == password) {
              setIsValid(true);
            } else {
              setIsValid(false);
            }
          }}
        />
      </div>
      <button
        disabled={!isValid}
        className="py-2 px-4 border-solid bg-primary rounded-xl text-inverse"
        onClick={(e) => {
          e.target.style.background = "#899dfc";
          resetPassword().then((response) => {
            e.target.style.background = null;
          });
        }}
      >
        Send
      </button>
    </>
  );
};

export default CreateNewPassword;
