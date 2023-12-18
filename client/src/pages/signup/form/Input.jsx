import { useEffect, useState } from "react";

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
  const [focused, setFocused] = useState(autoFocus);
  const verifyValue = (element) => {
    if (!element.value) {
      element.style.border = "solid 2px red";
      setData((prev) => ({ ...prev, [name]: element.value }));
      setInputError("Required");
    } else {
      const isValid = regex[name].test(element.value);
      if (isValid) {
        if (name === "email") {
          setData((prev) => ({
            ...prev,
            email: element.value.trim().toLowerCase(),
          }));
          fetch(
            `${process.env.REACT_APP_API_URL}/check_email/${element.value}`
          ).then((response) => {
            if (response.status === 200) {
              element.style.border = "solid 2px green";
              setInputError(null);
            } else {
              response.json().then((data) => {
                setInputError(data.message);
                element.style.border = "solid 2px red";
              });
            }
          });
        } else {
          element.style.border = "solid 2px green";
          setData((prev) => ({
            ...prev,
            [name]: element.value.trim(),
          }));
        }
        setInputError(null);
      } else {
        element.style.border = "solid 2px red";
        setData((prev) => ({ ...prev, [name]: element.value }));
        setInputError(`Invalid ${label.toLowerCase()}`);
      }
    }
  };
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
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
          window.sessionStorage.setItem([e.target.name], e.target.value);
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

      <div className="text-[red] h-7">{!focused && inputError}</div>
    </>
  );
};

export default Input;
