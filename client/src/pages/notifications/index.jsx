import Sidebar from "components/sidebar";

import { useWindowWidth } from "hooks/useWindowWidth";

const Notification = () => {
  const windowWidth = useWindowWidth();

  return (
    <>
      <div className="grid grid-cols-10 pt-5 pb-28 min-h-screen">
        {windowWidth > 1024 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-8 md:mx-0 md:col-span-6 lg:col-span-4 col-span-8">
          <div className="my-0 mx-auto"></div>
        </div>
      </div>
    </>
  );
};
export default Notification;
