import { useSelector } from "react-redux";

import UnloggedIn from "./UnloggedIn";
import LoggedIn from "./logged-in";

import "./index.css";

const Header = () => {
  const isLoggedIn = Boolean(
    useSelector((state) => state.user && state.authStatus.isVerified)
  );
  return (
    <header className="sticky top-0 z-40 w-full bg-300 shadow-lg py-2 transition">
      <div className="container px-4">
        {isLoggedIn && <LoggedIn />}
        {!isLoggedIn && <UnloggedIn />}
      </div>
    </header>
  );
};
export default Header;
