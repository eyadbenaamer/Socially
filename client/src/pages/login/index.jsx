import Form from "./Form";
import { useWindowWidth } from "hooks/useWindowWidth.js";
const Login = () => {
  const isMobileScreen = useWindowWidth({ maxWidth: 768 });

  return (
    <>
      <div className="container m-auto ">
        <h1 style={{ fontSize: isMobileScreen ? "1.5rem" : "2rem" }}>
          Welcome to Socially!
        </h1>
        <Form />
      </div>
    </>
  );
};
export default Login;
