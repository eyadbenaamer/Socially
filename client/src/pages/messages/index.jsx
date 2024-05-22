import Sidebar from "components/sidebar";
import Bar from "components/bar";

import { useWindowWidth } from "hooks/useWindowWidth";

const Messages = () => {
  const windowWidth = useWindowWidth();

  return (
    <>
      <div className="grid grid-cols-8 pt-5 pb-28 min-h-screen">
        {windowWidth >= 768 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-8 md:mx-0 md:col-span-6 lg:col-span-4 col-span-8">
          <div className="my-0 mx-auto"></div>
        </div>
      </div>
      {windowWidth <= 768 && <Bar />}
    </>
  );
};
export default Messages;
