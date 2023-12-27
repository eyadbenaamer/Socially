import DateInput from "./DateInput";
import submit from "./submit";
import { useState } from "react";
import Alert from "components/Alert";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "state";
import SubmitBtn from "components/SubmitBtn";
import PasswordInput from "./PasswordInput";
import Input from "./Input";
import EmailInput from "./EmailInput";
import { ReactComponent as LoadingIcon } from "../../../assets/icons/loading-circle.svg";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    window.sessionStorage.setItem([e.target.name], e.target.value);
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const dispatch = useDispatch();
  const [isValidInputs, setIsValidInputs] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const disabled = () => {
    for (const key in isValidInputs) {
      console.log(isValidInputs);
      if (!isValidInputs[key]) {
        return true;
      }
    }
    return false;
  };
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
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="col-span-1">
            <Input
              setIsValid={(isValid) =>
                setIsValidInputs({ ...isValidInputs, firstName: isValid })
              }
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
              setIsValid={(isValid) =>
                setIsValidInputs({ ...isValidInputs, lastName: isValid })
              }
              fieldValue={data.lastName}
              name={"lastName"}
              label={"Last Name"}
              placeholder={"Doe"}
              setData={setData}
            />
          </div>
          <div className="col-span-1">
            <EmailInput
              setIsValid={(isValid) =>
                setIsValidInputs({ ...isValidInputs, email: isValid })
              }
              fieldValue={data.email}
              setData={setData}
            />
          </div>

          <div className="col-span-1 ">
            <PasswordInput
              setIsValid={(isValid) =>
                setIsValidInputs({ ...isValidInputs, password: isValid })
              }
              data={data}
              setData={setData}
              name={"password"}
              fieldValue={data.password}
              placeholder={"Password"}
            />
          </div>
          <div className="col-span-1 ">
            <PasswordInput
              setIsValid={(isValid) =>
                setIsValidInputs({ ...isValidInputs, confirmPassword: isValid })
              }
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
          <select tabIndex={1} name="gender" onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className=" self-center">
          <SubmitBtn
            tabIndex={1}
            disabled={disabled()}
            onClick={() => {
              setIsLoading(true);
              submit(data).then((response) => {
                setIsLoading(false);
                const { message, isSignup } = response;
                dispatch(setAuthStatus({ email: data.email }));
                setIsSignup(isSignup);
                setIsOpened(true);
                setMessage(message);
              });
            }}
          >
            {isLoading ? <LoadingIcon height={24} stroke="white" /> : "Sign up"}
          </SubmitBtn>
        </div>
      </section>
    </>
  );
};
export default Form;
