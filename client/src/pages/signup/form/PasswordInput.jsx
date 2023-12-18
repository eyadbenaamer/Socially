import React, { useState } from "react";
import { ReactComponent as ShowPasswordIcon } from "../../../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../../../assets/icons/hide.svg";
import { useSelector } from "react-redux";

const PasswordInput = (props) => {
  const { setData, data, name, placeholder } = props;
  const mode = useSelector((state) => state.settings.mode);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [inputError, setInputError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <>
      <label htmlFor={name}>{placeholder}</label>
      <div className="relative w-full">
        <input
          style={{
            border: "2px solid transparent",
            borderRadius: "8px",
            boxShadow: "0px 1px 3px 0px #00000026",
          }}
          className={`pe-7 ${mode === "light" ? "bg-200" : "bg-alt"} p-[4px]`}
          type={passwordInputType}
          name={name}
          placeholder={placeholder}
          defaultValue={data.password}
          onFocus={(e) => {
            setInputError(null);
            e.target.style.border = "2px solid transparent";
            if (name === "password") {
              setShowPasswordForm(true);
            }
          }}
          onBlur={(e) => {
            if (name === "password") {
              if (e.target.value) {
                e.target.style.border = "2px solid green";
                setInputError(null);
              } else {
                e.target.style.border = "2px solid red";
                setInputError("Required");
              }
              setShowPasswordForm(false);
              setData((prev) => ({ ...prev, password: e.target.value }));
            } else {
              if (e.target.value) {
                if (e.target.value != data.password) {
                  e.target.style.border = "2px solid red";
                  setInputError("Passwords don't match.");
                } else {
                  e.target.style.border = "2px solid green";
                  setInputError(null);
                }
              } else {
                e.target.style.border = "2px solid red";
                setInputError("Required");
              }
            }
          }}
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
        {showPasswordForm && (
          <div className="absolute text-sm right-0 bottom-16 shadow-sm z-50 min-w-full bg-200 py-2 ps-2 radius">
            <div>Length at least 8 letters</div>
            <div>Contains at least 1 digit</div>
            <div>Contains at least 1 character</div>
            <div>Contains at least 1 upper case letter</div>
            <div>Contains at least 1 lower case letter</div>
          </div>
        )}
      </div>
      <div className="text-[red] h-3 text-sm">{inputError}</div>
    </>
  );
};

export default PasswordInput;
