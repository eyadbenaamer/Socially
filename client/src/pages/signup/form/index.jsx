// import Dropzone from "../../components/dropzone";
import { Link } from "react-router-dom";
import DateInput from "./DateInput";
import submit from "./submit";
import { useRef, useState } from "react";
import DropZone from "components/dropzone";

const Form = (props) => {
  const { setSignupDetails } = props;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    gender: "male",
  });
  const handleChange = async (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
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
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onKeyDown={handleEnterSubmit}
          />
          <DateInput setData={setData} />

          <select name="gender" onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <DropZone
            onChange={(file) => {
              data.picture = file;
            }}
          />
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
