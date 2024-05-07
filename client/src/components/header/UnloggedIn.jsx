import { useSelector } from "react-redux";

import ToggleTheme from "../ToggleTheme";

import darkLogo from "../../assets/icons/logo-dark.svg";
import lightLogo from "../../assets/icons/logo-light.svg";
import { Link } from "react-router-dom";

const UnloggedIn = () => {
  const theme = useSelector((state) => state.settings).theme;

  return (
    <div className="m-auto py-2 flex gap-3 items-center justify-between">
      <Link to="/">
        {theme === "light" ? (
          <img src={lightLogo} alt="Socially" />
        ) : (
          <img src={darkLogo} alt="Socially" />
        )}
      </Link>
      <ToggleTheme />
    </div>
  );
};

export default UnloggedIn;
