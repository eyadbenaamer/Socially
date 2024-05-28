import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";

import axiosClient from "utils/AxiosClient";

import tickAnimationData from "assets/icons/tick.json";
import crossAnimationData from "assets/icons/cross.json";
import { ReactComponent as LoadingIcon } from "assets/icons/loading-circle.svg";

const EmailInput = (props) => {
  const { fieldValue, setData, setIsValid, type, placeholder } = props;
  const [check, setCheck] = useState({ state: "", message: "" });

  const regex = /((\w)+.?)+@\w{1,}\.\w{2,}/gi;
  const input = useRef(null);
  useEffect(
    () => setIsValid(check.state === "success" ? true : false),
    [check]
  );
  const [focused, setFocused] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(true);

  const verifyValue = () => {
    if (!fieldValue) {
      input.current.style.border = "solid 2px red";
      setData((prev) => ({ ...prev, email: fieldValue }));
      setIsEmailChecked(true);
      setCheck({ state: "fail", message: "Required" });
      return;
    }
    const isValid = regex.test(fieldValue);
    if (isValid) {
      setData((prev) => ({
        ...prev,
        email: fieldValue.trim().toLowerCase(),
      }));
      axiosClient(`check_email_availability/${type}/${fieldValue}`)
        .then((response) => {
          const { message } = response.data;
          input.current.style.border = "solid 2px green";
          setCheck({
            state: "success",
            message,
          });
        })
        .catch((error) => {
          setCheck({ state: "fail", message: error.response.data.message });
          input.current.style.border = "solid 2px red";
        });
      setIsEmailChecked(true);
      setCheck({ state: "success" });
    } else {
      input.current.style.border = "solid 2px red";
      setData((prev) => ({ ...prev, email: fieldValue }));
      setIsEmailChecked(true);
      setCheck({
        state: "fail",
        message: "Invalid email",
      });
    }
  };

  return (
    <>
      <label htmlFor="eamil">Email</label>
      <div className="flex gap-2 items-center">
        <input
          tabIndex={1}
          ref={input}
          defaultValue={fieldValue}
          placeholder={placeholder === null ? "email.example.com" : ""}
          style={{
            borderRadius: 8,
            boxShadow: "0px 1px 3px 0px #00000026",
            border: "solid 2px transparent",
          }}
          className="p-[4px] bg-200"
          onFocus={(e) => {
            e.target.style.border = "solid 2px transparent";
            setIsEmailChecked(false);
            setFocused(true);
          }}
          onChange={(e) => {
            const value = e.target.value.trim();
            setData((prev) => ({ ...prev, email: value }));
            window.sessionStorage.setItem("email", value);
          }}
          onBlur={() => {
            verifyValue();
            setFocused(false);
          }}
          type="text"
          name="email"
        />
        <div className="w-10">
          {!focused &&
            (!isEmailChecked ? (
              <LoadingIcon />
            ) : (
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
            ))}
        </div>
      </div>
      <div
        className={`${
          check.state === "fail" ? "text-[red]" : "text-[green]"
        } h-7`}
      >
        {!focused && check.message}
      </div>
    </>
  );
};

export default EmailInput;
