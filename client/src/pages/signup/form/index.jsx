import DateInput from "./DateInput";
import submit from "./submit";
import { useRef, useState } from "react";
import Alert from "components/Alert";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus } from "state";
import SubmitBtn from "components/SubmitBtn";

import { ReactComponent as ShowPasswordIcon } from "../../../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../../../assets/icons/hide.svg";

const Form = (props) => {
  const { setIsSignup } = props;
  const [data, setData] = useState({
    firstName: sessionStorage.getItem("firstName") ?? "",
    lastName: sessionStorage.getItem("lastName") ?? "",
    email: sessionStorage.getItem("email") ?? "",
    password: sessionStorage.getItem("password") ?? "",
    birthDate: sessionStorage.getItem("birthDate") ?? "",
    gender: sessionStorage.getItem("gender") ?? "male",
  });
  const [message, setMessage] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const handleChange = async (e) => {
    window.sessionStorage.setItem([e.target.name], e.target.value);
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submitButton = useRef(null);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.settings.mode);
  const [passwordInputType, setPasswordInputType] = useState([
    "password",
    "password",
  ]);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  const confirmPassword = useRef();
  return (
    <>
      {isOpened && (
        <div>
          <Alert
            type={"error"}
            message={message}
            isOpened={isOpened}
            setIsOpened={setIsOpened}
          />
        </div>
      )}
      <section>
        <div className="flex flex-col gap-4 w-fit">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                placeholder="John"
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                onKeyDown={handleEnterSubmit}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                onKeyDown={handleEnterSubmit}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={data.email}
                onChange={handleChange}
                onKeyDown={handleEnterSubmit}
              />
            </div>
            <div className="col-span-1 ">
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
                  type={passwordInputType[0]}
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={handleChange}
                  onKeyDown={handleEnterSubmit}
                />
                <button
                  onClick={() =>
                    setPasswordInputType([
                      passwordInputType[0] === "password" ? "text" : "password",
                      passwordInputType[1],
                    ])
                  }
                  className="w-5"
                >
                  {passwordInputType[0] === "password" ? (
                    <ShowPasswordIcon />
                  ) : (
                    "text" && <HidePasswordIcon />
                  )}
                </button>
              </div>
            </div>
            <div className="col-span-1 ">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div
                ref={confirmPassword}
                className={`flex ${
                  mode === "light" ? "bg-200" : "bg-alt"
                } border p-[6px]`}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0px 1px 3px 0px #00000026",
                }}
              >
                <input
                  type={passwordInputType[1]}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onFocus={(e) =>
                    (confirmPassword.current.style.border = "none")
                  }
                  onBlur={(e) => {
                    if (e.target.value !== data.password) {
                      confirmPassword.current.style.border = "solid red 2px";
                    } else {
                      confirmPassword.current.style.border = "solid green 2px";
                    }
                  }}
                  onKeyDown={handleEnterSubmit}
                />
                <button
                  onClick={() =>
                    setPasswordInputType([
                      passwordInputType[0],
                      passwordInputType[1] === "password" ? "text" : "password",
                    ])
                  }
                  className="w-5"
                >
                  {passwordInputType[1] === "password" ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block">Birthdate</label>
            <DateInput setData={setData} />
          </div>
          <div>
            <label className="block" htmlFor="gender">
              Gender
            </label>
            <select name="gender" onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className=" self-center">
            <SubmitBtn
              onClick={() =>
                submit(data).then((response) => {
                  const { message, isSignup } = response;
                  dispatch(setAuthStatus({ email: data.email }));
                  setIsSignup(isSignup);
                  // setMessage((prev) => {
                  //   prev = "";
                  //   return prev;
                  // });
                  setIsOpened(true);
                  setMessage(message);
                })
              }
            >
              Signup
            </SubmitBtn>
          </div>
        </div>
      </section>
    </>
  );
};
export default Form;
