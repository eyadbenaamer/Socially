import DateInput from "./DateInput";
import submit from "./submit";
import { useState } from "react";
import Alert from "components/Alert";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "state";
import SubmitBtn from "components/SubmitBtn";
import PasswordInput from "./PasswordInput";
import Input from "./Input";

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
  const [isOpened, setIsOpened] = useState(false);
  const handleChange = (e) => {
    window.sessionStorage.setItem([e.target.name], e.target.value);
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const dispatch = useDispatch();

  return (
    <>
      {isOpened && (
        <div>
          <Alert
            type={"error"}
            message={message}
            isOpened={isOpened}
            setIsOpened={setIsOpened}
          />
        </div>
      )}
      <section>
        <div className="flex flex-col gap-4 w-fit">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1">
              <Input
                setIsValid={() => {}}
                fieldValue={data.firstName}
                name={"firstName"}
                label={"First Name"}
                placeholder={"John"}
                autoFocus={true}
                setData={setData}
              />
            </div>
            <div className="col-span-1">
              <Input
                setIsValid={() => {}}
                fieldValue={data.lastName}
                name={"lastName"}
                label={"Last Name"}
                placeholder={"Doe"}
                setData={setData}
              />
            </div>
            <div className="col-span-1">
              <Input
                setIsValid={() => {}}
                fieldValue={data.email}
                name={"email"}
                label={"Email"}
                placeholder={"email@example.com"}
                setData={setData}
              />
            </div>

            <div className="col-span-1 ">
              <PasswordInput
                data={data}
                setData={setData}
                name={"password"}
                placeholder={"Password"}
              />
            </div>
            <div className="col-span-1 ">
              <PasswordInput
                data={data}
                setData={setData}
                name={"confirmPassword"}
                placeholder={"Confirm Password"}
              />
            </div>
          </div>

          <div>
            <label className="block">Birthdate</label>
            <DateInput setData={setData} />
          </div>
          <div>
            <label className="block" htmlFor="gender">
              Gender
            </label>
            <select name="gender" onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className=" self-center">
            <SubmitBtn
              onClick={() =>
                submit(data).then((response) => {
                  const { message, isSignup } = response;
                  dispatch(setAuthStatus({ email: data.email }));
                  setIsSignup(isSignup);
                  setIsOpened(true);
                  setMessage(message);
                })
              }
            >
              Signup
            </SubmitBtn>
          </div>
        </div>
      </section>
    </>
  );
};
export default Form;
