import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as ShowPasswordIcon } from "../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../assets/icons/hide.svg";

const Input = (props) => {
  const { name, label, fieldValue, autoFocus, setData, setIsValid } = props;
  const [inputError, setInputError] = useState("");
  const regex = {
    email: /((\w)+.?)+@\w{1,}\.\w{2,}/gi,
    firstName:
      /.[^!|@|#|$|%|^|&|*|(|)|_|-|=|+|<|>|/|\\|'|"|:|;|[|]|\{|\}]{2,}/gi,
    lastName:
      /.[^!|@|#|$|%|^|&|*|(|)|_|-|=|+|<|>|/|\\|'|"|:|;|[|]|\{|\}]{2,}/gi,
    password: /(\d+|\W+|.+){8,}/gi,
    confirmPassword: /(\d+|\W+|.+){8,}/gi,
  };
  useEffect(() => setIsValid(inputError), [inputError]);
  const inputContainer = useRef();
  const [focused, setFocused] = useState(autoFocus);
  const { pathname: path } = useLocation();
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div
        style={{ borderRadius: 8, boxShadow: "0px 1px 3px 0px #00000026" }}
        ref={inputContainer}
        className="relative flex items-center h-9"
      >
        <input
          style={{ borderRadius: 8 }}
          className="p-[4px] absolute bg-200 left-0 top-0"
          autoFocus={autoFocus}
          onFocus={(e) => {
            if (inputContainer.current)
              inputContainer.current.style.border = "none";
            setFocused(true);
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              if (inputContainer.current)
                inputContainer.current.style.border = "solid 2px red";
              setData((prev) => ({ ...prev, [name]: e.target.value }));
              setInputError("Required");
            } else {
              const isValid = regex[name].test(e.target.value);

              if (isValid) {
                if (inputContainer.current)
                  inputContainer.current.style.border =
                    path === "/singup" ? "solid 2px green" : "none";
                setData((prev) => ({ ...prev, [name]: e.target.value }));

                setInputError(null);
              } else {
                if (inputContainer.current)
                  setData((prev) => ({ ...prev, [name]: e.target.value }));
                inputContainer.current.style.border = "solid 2px red";
                setInputError("Invalid value");
              }
            }
            setFocused(false);
          }}
          type="text"
          name={name}
          // onChange={(e) =>
          // }
          // onKeyDown={handleEnterSubmit}
        />
        {(name === "password" || name === "confirmPassword" || true) && (
          <div className="w-5 z-10 absolute right-0 top-[10px]">
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
