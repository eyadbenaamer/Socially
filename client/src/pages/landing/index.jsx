import { useLocation } from "react-router-dom";
import Login from "./login";
import VerifyAccount from "./verify-account";
import ResetPassword from "./reset-password";

const Landing = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/login" && <Login />}
      {location.pathname === "/verify-account" && <VerifyAccount />}
      {location.pathname === "/reset-password" && <ResetPassword />}
    </>
  );
};

export default Landing;
