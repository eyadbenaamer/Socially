import { Link } from "react-router-dom";
import Header from "../../components/header";
import LoginForm from "../login/Form";
import { useWindowWidth } from "hooks/useWindowWidth.js";

const Landing = () => {
  const isMobileScreen = useWindowWidth({ maxWidth: 768 });
  return (
    <>
      <div className="container m-auto ">
        <h1 style={{ fontSize: isMobileScreen ? "1.5rem" : "2rem" }}>
          Welcome to Socially!
        </h1>
        <LoginForm />
      </div>
    </>
  );
};
export default Landing;
