import { Link } from "react-router-dom";
import DateInput from "./DateInput";
import submit from "./submit";
import { useRef, useState } from "react";
import Alert from "components/Alert";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "state";
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

  const handleChange = async (e) => {
    window.sessionStorage.setItem([e.target.name], e.target.value);
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitButton = useRef(null);
  const dispatch = useDispatch();
  dispatch(setLoginStatus({ message: "" }));

  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  return (
    <>
      {message && (
        <div>
          <Alert type={"error"} message={message} />
        </div>
      )}
      <section>
        <form>
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <DateInput setData={setData} />

          <select name="gender" onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </form>
        <button
          ref={submitButton}
          onClick={() =>
            submit(data).then((response) => {
              dispatch(setLoginStatus({ email: data.email }));
              const { message, isSignup } = response;
              sessionStorage.setItem("isNotVerified", true);
              setIsSignup(isSignup);
              setMessage(message);
            })
          }
        >
          Signup
        </button>
        <div>
          Already have an account?{" "}
          <Link to="/login" replace={true}>
            Log in here
          </Link>
        </div>
      </section>
    </>
  );
};
export default Form;
