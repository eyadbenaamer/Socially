import { Link } from "react-router-dom";
import Form from "./Form";
import { useSelector } from "react-redux";
const Login = () => {
  const mode = useSelector((state) => state.settings.mode);
  return (
    <div className="container m-auto">
      <div
        className={`auth flex flex-col gap-3 w-fit my-5 mx-auto shadow-md radius p-4 bg-300 ${
          mode === "light" ? "border" : ""
        }`}
      >
        <h2 className="text-2xl">Welcome to Socially!</h2>
        <Form />
        <div>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className=" hover:underline hover:text-[var(--primary-color)]"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
