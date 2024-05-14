import { useRef, useState } from "react";
import submit from "./submit";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus, setUser } from "state";
import { Link, Navigate } from "react-router-dom";
import { ReactComponent as ShowPasswordIcon } from "../../assets/icons/eye.svg";
import { ReactComponent as HidePasswordIcon } from "../../assets/icons/hide.svg";
import { ReactComponent as LoadingIcon } from "../../assets/icons/loading-circle.svg";

const Form = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(null);
  const submitButton = useRef(null);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  const [disabled, setDisabled] = useState(false);
  const theme = useSelector((state) => state.settings.theme);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [inputError, setInputError] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isVerified === false && <Navigate to={"/verify-account"} />}

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
          <button
            ref={submitButton}
            className="py-2 px-4 border-solid bg-primary rounded-xl text-white disabled:opacity-70"
            disabled={disabled || inputError.email || inputError.password}
            onClick={() => {
              if (!(disabled || inputError.email || inputError.password)) {
                setIsLoading(true);
                setDisabled(true);
                submit(data).then((response) => {
                  let { message, user, isVerified } = response;
                  setMessage(message);
                  setDisabled(false);
                  setIsLoading(false);
                  !isVerified &&
                    dispatch(
                      setAuthStatus({ email: data.email, message, isVerified })
                    );
                  isVerified &&
                    dispatch(
                      setAuthStatus({
                        email: data.email,
                        isLoggedIn: true,
                        isVerified,
                      })
                    );
                  dispatch(setUser(user));
                  setIsVerified(isVerified);
                });
              }
            }}
          >
            {isLoading ? <LoadingIcon height={24} stroke="white" /> : "Log in"}
          </button>
        </div>
      </section>
    </>
  );
};
export default Form;
