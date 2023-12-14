import { Link } from "react-router-dom";
import Form from "./Form";
const Login = () => {
  return (
    <div className="container m-auto">
      <div className="auth flex flex-col gap-3 w-fit my-5 mx-auto shadow-md radius p-4 bg-300">
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
