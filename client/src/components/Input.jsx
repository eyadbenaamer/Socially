import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as ShowPasswordIcon } from "../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../assets/icons/hide.svg";

const Input = (props) => {
  const { name, label, fieldValue, autoFocus, setData, setIsValid } = props;
  const [inputError, setInputError] = useState("");
  const regex = {
    email: /((\w)+.?)+@\w+\.\w{2,}/gi,
    firstName: /[a-z]/gi,
    lastName: /[a-z]+/gi,
    password: /(\d+|\W+|.+){8,}/gi,
    confirmPassword: /(\d+|\W+|.+){8,}/gi,
  };
  useEffect(() => setIsValid(inputError), [inputError]);
  const isValid = regex[name].test(fieldValue);
  const [focused, setFocused] = useState(autoFocus);
  const { pathname: path } = useLocation();
  const inputContainer = useRef();
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div
        style={{ borderRadius: 8, boxShadow: "0px 1px 3px 0px #00000026" }}
        ref={inputContainer}
        className="flex items-center "
      >
        <input
          style={{ borderRadius: 8 }}
          className="p-[4px]"
          autoFocus={autoFocus}
          onFocus={(e) => {
            if (inputContainer.current)
              inputContainer.current.style.border = "none";
            setFocused(true);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (!fieldValue) {
              if (inputContainer.current)
                inputContainer.current.style.border = "solid 2px red";

              setInputError("Required");
            } else {
              if (isValid) {
                if (inputContainer.current)
                  inputContainer.current.style.border =
                    path === "/singup" ? "solid 2px green" : "none";
                setInputError(null);
              } else {
                if (inputContainer.current)
                  inputContainer.current.style.border = "solid 2px red";
                setInputError("Invalid value");
              }
            }
          }}
          type="text"
          name={name}
          onChange={(e) =>
            setData((prev) => ({ ...prev, [name]: e.target.value }))
          }
          // onKeyDown={handleEnterSubmit}
        />
        {(name === "password" || name === "confirmPassword") && (
          <div className="w-5">
            <HidePasswordIcon />
          </div>
        )}
      </div>

      <div className="text-[red] h-7">
        {inputError && !focused ? inputError : ""}
      </div>
    </>
  );
};

export default Input;
