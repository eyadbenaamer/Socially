import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";

import tickAnimationData from "assets/icons/tick.json";
import crossAnimationData from "assets/icons/cross.json";

const Input = (props) => {
  const {
    name,
    label,
    fieldValue,
    autoFocus,
    setData,
    setIsValid,
    placeholder,
  } = props;
  const [check, setCheck] = useState({ state: "", message: "" });

  const regex =
    /.[^!|@|#|$|%|^|&|*|(|)|_|-|=|+|<|>|/|\\|'|"|:|;|[|]|\{|\}]{2,}/gi;

  const input = useRef(null);
  useEffect(() => {
    if (!focused && fieldValue && input.current) {
      verifyValue(input.current);
    }
  }, []);

  useEffect(
    () => setIsValid(check.state === "success" ? true : false),
    [check]
  );

  const [focused, setFocused] = useState(autoFocus);
  const verifyValue = () => {
    if (!fieldValue) {
      input.current.style.border = "solid 2px red";
      setData((prev) => ({ ...prev, [name]: fieldValue }));
      setCheck({ state: "fail", message: "Required" });
    } else {
      const isValid = regex.test(fieldValue);
      if (isValid) {
        input.current.style.border = "solid 2px green";
        setData((prev) => ({
          ...prev,
          [name]: fieldValue.trim(),
        }));
        setCheck({ state: "success" });
      } else {
        input.current.style.border = "solid 2px red";
        setData((prev) => ({ ...prev, [name]: fieldValue }));

        setCheck({
          state: "fail",
          message: `Invalid ${label.toLowerCase()}`,
        });
      }
    }
  };

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div className="flex gap-2 items-center">
        <input
          tabIndex={1}
          ref={input}
          defaultValue={fieldValue}
          placeholder={placeholder}
          style={{
            borderRadius: 8,
            boxShadow: "0px 1px 3px 0px #00000026",
            border: "solid 2px transparent",
          }}
          className="p-[4px] bg-200"
          autoFocus={autoFocus}
          onFocus={(e) => {
            e.target.style.border = "solid 2px transparent";
            setFocused(true);
          }}
          onChange={(e) => {
            const value = e.target.value.trim();
            setData((prev) => ({ ...prev, [name]: value }));
            window.sessionStorage.setItem([e.target.name], value);
            if (!focused) {
              verifyValue(e.target);
            }
          }}
          onBlur={(e) => {
            verifyValue(e.target);
            setFocused(false);
          }}
          type="text"
          name={name}
        />
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

export default Input;
