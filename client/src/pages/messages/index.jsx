import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";
import Bar from "components/bar";

const Messages = () => {
  const windowWidth = useWindowWidth();
  return (
    <>
      <div className="grid grid-cols-5 min-h-screen">
        {windowWidth >= 1100 && (
          <div className="sidebar flex justify-center col-span-1">
            <Sidebar />
          </div>
        )}
        <div className="content md:col-span-4  col-span-5">
          <div className=" w-full lg:w-3/4   my-0 m-auto"></div>
        </div>
      </div>
      {windowWidth <= 768 && <Bar />}
    </>
  );
};

export default Messages;
