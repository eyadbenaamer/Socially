import { useSelector } from "react-redux";

import darkLogo from "../../../assets/icons/logo-dark.svg";
import lightLogo from "../../../assets/icons/logo-light.svg";
import { Link } from "react-router-dom";
import Menu from "./Menu";

const LoggedIn = () => {
  const mode = useSelector((state) => state.settings).mode;

  return (
    <div className="shadow-lg bg-300  transition-all">
      <div className="container m-auto  flex gap-3 items-center justify-between">
        <Link className="py-4" to="/">
          {mode === "light" ? (
            <img src={lightLogo} alt="Socially" />
          ) : (
            <img src={darkLogo} alt="Socially" />
          )}
        </Link>

        <Menu />
      </div>
    </div>
  );
};

export default LoggedIn;
