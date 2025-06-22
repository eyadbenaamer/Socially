import Sidebar from "./sidebar";
import Bar from "./bar";

import { useWindowWidth } from "hooks/useWindowWidth";

const Layout = ({ children }) => {
  const windowWidth = useWindowWidth();

  return (
    <>
      <div className="grid grid-cols-10 pt-5">
        {windowWidth >= 1024 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-10 md:mx-0 lg:col-span-6 col-span-10 px-3">
          {children}
        </div>
      </div>
      {windowWidth < 1024 && <Bar />}
    </>
  );
};

export default Layout;
