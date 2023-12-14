import { useEffect, useRef, useState } from "react";
import submit from "./submit";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus, setUser } from "state";
import { Link, Navigate, useLocation } from "react-router-dom";
import SubmitBtn from "components/SubmitBtn";
import { ReactComponent as ShowPasswordIcon } from "../../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../../assets/icons/hide.svg";
import Input from "components/Input";

const Form = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(null);
  const submitButton = useRef(null);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  const [disabled, setDisabled] = useState(false);
  const mode = useSelector((state) => state.settings.mode);

  const [passwordInputType, setPasswordInputType] = useState("password");
  const [inputError, setInputError] = useState({ email: "", password: "" });
  return (
    <>
      {isVerified === false && <Navigate to={"/verify-account"} />}

      <section className="flex flex-col gap-4 w-fit center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="col-span-1">
            <Input
              setIsValid={(isValid) =>
                setInputError({ ...inputError, email: isValid })
              }
              autoFocus={true}
              label={"Email"}
              name={"email"}
              fieldValue={data.email}
              setData={setData}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="password">Password</label>
            <div
              className={`flex ${
                mode === "light" ? "bg-200" : "bg-alt"
              } border p-[6px]`}
              style={{
                borderRadius: "8px",
                boxShadow: "0px 1px 3px 0px #00000026",
              }}
            >
              <input
                autoComplete="false"
                type={passwordInputType}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                // onKeyDown={handleEnterSubmit}
              />
              <button
                onClick={() =>
                  setPasswordInputType(
                    passwordInputType === "password" ? "text" : "password"
                  )
                }
                className="w-5"
              >
                {passwordInputType === "password" ? (
                  <ShowPasswordIcon />
                ) : (
                  "text" && <HidePasswordIcon />
                )}
              </button>
            </div>
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
            disabled={disabled || inputError.email || inputError.password}
            onClick={() => {
              setDisabled(true);
              submit(data).then((response) => {
                let { message, user, isVerified } = response;
                setMessage(message);
                setDisabled(false);
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
            }}
          >
            Log in
          </SubmitBtn>
        </div>
      </section>
    </>
  );
};
export default Form;
