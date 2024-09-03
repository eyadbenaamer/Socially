import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setAuthStatus,
  setContacts,
  setProfile,
  setUnreadMessagesCount,
} from "state";

import SubmitBtn from "components/SubmitBtn";

import axiosClient from "utils/AxiosClient";

import { ReactComponent as ShowPasswordIcon } from "assets/icons/eye.svg";
import { ReactComponent as HidePasswordIcon } from "assets/icons/hide.svg";
import { connectToSocketServer } from "hooks/useHandleSocket";

const Form = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const submitButton = useRef(null);
  const theme = useSelector((state) => state.settings.theme);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [inputError, setInputError] = useState({ email: "", password: "" });
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };

  const submit = async () => {
    await axiosClient
      .post(`/login`, data)
      .then((response) => {
        const { token, profile, isVerified, contacts, unreadMessagesCount } =
          response.data;
        // set all accounts info once login
        localStorage.setItem("token", token);
        dispatch(setProfile(profile));
        dispatch(setContacts(contacts));
        dispatch(setUnreadMessagesCount(unreadMessagesCount));

        // connect to socket server once login
        connectToSocketServer();

        dispatch(
          setAuthStatus({
            email: "",
            message: "",
            isLoggedin: true,
            isVerified,
          })
        );
      })
      .catch((error) => {
        const { message, isVerified } = error.response.data;
        setMessage(message);
        if (isVerified === false) {
          sessionStorage.setItem("isNotVerified", true);
          dispatch(
            setAuthStatus({
              email: data.email,
              isLoggedin: true,
              message: message,
              isVerified,
            })
          );
        } else {
          dispatch(
            setAuthStatus({
              email: "",
              isLoggedin: false,
              message: message,
              isVerified: false,
            })
          );
        }
      });
  };

  return (
    <section className="flex flex-col gap-4 w-fit center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-1">
          <label htmlFor="email">Email</label>
          <input
            style={{
              border: "2px solid transparent",
              borderRadius: "8px",
              boxShadow: "0px 1px 3px 0px #00000026",
            }}
            className={`flex ${
              theme === "light" ? "bg-200" : "bg-alt"
            } p-[4px]`}
            type="text"
            name="email"
            autoFocus
            placeholder="email"
            value={data.email}
            onChange={(e) => {
              if (e.target.value) {
                e.target.style.border = "2px solid transparent";
                setInputError({ ...inputError, email: "" });
              } else {
                e.target.style.border = "2px solid red";
                setInputError({ ...inputError, email: "Required" });
              }
              setData({ ...data, email: e.target.value });
            }}
            onKeyDown={handleEnterSubmit}
          />
          <div className="text-[red]">{inputError.email}</div>
        </div>
        <div className="col-span-1">
          <label htmlFor="password">Password</label>
          <div className="relative w-full">
            <input
              style={{
                border: "2px solid transparent",
                borderRadius: "8px",
                boxShadow: "0px 1px 3px 0px #00000026",
              }}
              className={`pe-7 ${
                theme === "light" ? "bg-200" : "bg-alt"
              } p-[4px]`}
              autoComplete="false"
              type={passwordInputType}
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => {
                if (e.target.value) {
                  e.target.style.border = "2px solid transparent";
                  setInputError({ ...inputError, password: "" });
                } else {
                  e.target.style.border = "2px solid red";
                  setInputError({ ...inputError, password: "Required" });
                }
                setData({ ...data, password: e.target.value });
              }}
              onKeyDown={handleEnterSubmit}
            />
            <button
              className="absolute w-5 right-[5px] top-[8px]"
              onClick={() =>
                setPasswordInputType(
                  passwordInputType === "password" ? "text" : "password"
                )
              }
            >
              {passwordInputType === "password" ? (
                <ShowPasswordIcon />
              ) : (
                "text" && <HidePasswordIcon />
              )}
            </button>
          </div>
          <div className="text-[red]">{inputError.password}</div>
        </div>
      </div>
      {message && <div className="text-[red]">{message}</div>}
      <Link
        to={"/reset-password"}
        className="w-fit hover:underline text-[var(--primary-color)]"
      >
        Forgot password?
      </Link>
      <div className="self-center sm:self-start">
        <SubmitBtn
          ref={submitButton}
          onClick={async () => {
            await submit();
          }}
        >
          Login
        </SubmitBtn>
      </div>
    </section>
  );
};
export default Form;
