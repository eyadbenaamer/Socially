import { useSelector } from "react-redux";

import UnloggedIn from "./UnloggedIn";
import LoggedIn from "./logged-in";

const Header = () => {
  const isLoggedIn = Boolean(
    useSelector((state) => state.user && state.isVerified)
  );
  return (
    <header className="fixed top-0 z-10 w-full">
      {isLoggedIn && <LoggedIn />}
      {!isLoggedIn && <UnloggedIn />}
    </header>
  );
};
export default Header;
