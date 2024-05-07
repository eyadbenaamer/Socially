import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as ShowPasswordIcon } from "../../../assets/icons/show.svg";
import { ReactComponent as HidePasswordIcon } from "../../../assets/icons/hide.svg";
import tickAnimationData from "../../../assets/icons/tick.json";
import crossAnimationData from "../../../assets/icons/cross.json";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Lottie from "react-lottie";

const PasswordInput = (props) => {
  const { setData, fieldValue, setIsValid, data, name, placeholder } = props;
  const theme = useSelector((state) => state.settings.theme);
  const [inputType, setInputType] = useState("password");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [focused, setFocused] = useState(false);
  const [check, setCheck] = useState({ state: "", message: "" });

  const regex =
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/g;
  const input = useRef(null);
  useEffect(
    () => setIsValid(check.state === "success" ? true : false),
    [check]
  );
  useEffect(() => {
    if (!focused && fieldValue && input.current) {
      verifyValue(input.current);
    }
  }, []);
  const verifyValue = () => {
    if (name === "password") {
      if (!fieldValue) {
        input.current.style.border = "solid 2px red";
        setData((prev) => ({ ...prev, password: fieldValue }));
        setCheck({ state: "fail", message: "Required" });
        return;
      }
      const isValid = regex.test(fieldValue);
      if (isValid) {
        setData((prev) => ({
          ...prev,
          [name]: fieldValue.trim(),
        }));
        input.current.style.border = "solid 2px green";
        setCheck({ state: "success" });
      } else {
        input.current.style.border = "solid 2px red";
        setData((prev) => ({ ...prev, [name]: fieldValue }));

        setCheck({
          state: "fail",
          message: "Invalid password",
        });
      }
    }
    if (name === "confirmPassword") {
      if (!input.current.value) {
        input.current.style.border = "solid 2px red";
        setCheck({ state: "fail", message: "Required" });
        return;
      } else {
        if (input.current.value === data.password) {
          input.current.style.border = "solid 2px green";
          setCheck({ state: "success" });
        } else {
          input.current.style.border = "solid 2px red";
          setCheck({ state: "fail", message: "Passwords don't match" });
        }
      }
    }
  };
  return (
    <>
      <label htmlFor={name}>{placeholder}</label>
      <div className="flex gap-2 items-center">
        <div className="relative w-full">
          <input
            tabIndex={1}
            ref={input}
            style={{
              border: "2px solid transparent",
              borderRadius: "8px",
              boxShadow: "0px 1px 3px 0px #00000026",
            }}
            className={`pe-7 ${
              theme === "light" ? "bg-200" : "bg-alt"
            } p-[4px]`}
            type={inputType}
            name={name}
            placeholder={placeholder}
            defaultValue={name === "password" ? data.password : ""}
            onFocus={(e) => {
              e.target.style.border = "solid 2px transparent";
              if (name === "password") {
                setShowPasswordForm(true);
              }
              setFocused(true);
            }}
            onChange={(e) => {
              const value = e.target.value.trim();
              setData((prev) => ({ ...prev, [name]: value }));
              window.sessionStorage.setItem([e.target.name], value);
            }}
            onBlur={(e) => {
              verifyValue(e.target);
              setFocused(false);
              setShowPasswordForm(false);
            }}
          />
          <button
            tabIndex={-1}
            className="absolute w-5 right-[5px] top-[8px]"
            onClick={() =>
              setInputType(inputType === "password" ? "text" : "password")
            }
          >
            {inputType === "password" ? (
              <ShowPasswordIcon />
            ) : (
              "text" && <HidePasswordIcon />
            )}
          </button>
          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute text-sm right-0 bottom-16 shadow-sm z-50 min-w-full bg-200 py-2 ps-2 rounded-xl"
            >
              <div>Length at least 8 letters</div>
              <div>Contains at least 1 digit</div>
              <div>Contains at least 1 character</div>
              <div>Contains at least 1 upper case letter</div>
              <div>Contains at least 1 lower case letter</div>
            </motion.div>
          )}
        </div>
        <div className="w-10">
          {!focused && (
            <>
              {check.state === "fail" ? (
                <Lottie
                  width={36}
                  height={36}
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData: crossAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              ) : check.state === "success" ? (
                <Lottie
                  width={24}
                  height={24}
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData: tickAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>

      <div className="text-[red] h-3 text-sm">
        {!focused ? check.message : ""}
      </div>
    </>
  );
};

export default PasswordInput;
