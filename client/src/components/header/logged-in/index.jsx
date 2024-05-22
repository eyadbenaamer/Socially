import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Menu from "./Menu";

import darkLogo from "assets/icons/logo-dark.svg";
import lightLogo from "assets/icons/logo-light.svg";

const LoggedIn = () => {
  const theme = useSelector((state) => state.settings).theme;

  return (
    <div className="m-auto flex gap-3 items-center justify-between">
      <Link className="py-4" to="/">
        {theme === "light" ? (
          <img src={lightLogo} alt="Socially" />
        ) : (
          <img src={darkLogo} alt="Socially" />
        )}
      </Link>
      <Menu />
    </div>
  );
};

export default LoggedIn;
