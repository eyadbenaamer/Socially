// import Dropzone from "../../components/dropzone";
import { Link } from "react-router-dom";
import DateInput from "./DateInput";
import submit from "./submit";
import { useRef, useState } from "react";
const Form = (props) => {
  const { setSignupDetails } = props;
  const [data, setData] = useState({
    firstName: sessionStorage.getItem("firstName") ?? "",
    lastName: sessionStorage.getItem("lastName") ?? "",
    email: sessionStorage.getItem("email") ?? "",
    password: sessionStorage.getItem("password") ?? "",
    birthDate: sessionStorage.getItem("birthDate") ?? "",
    gender: sessionStorage.getItem("gender") ?? "male",
  });
  const handleChange = async (e) => {
    window.sessionStorage.setItem([e.target.name], e.target.value);
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitButton = useRef(null);
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      submitButton.current.click();
    }
  };
  return (
    <>
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
          onClick={async () => await submit(data, setSignupDetails)}
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
