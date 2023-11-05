import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";

const SavedPosts = () => {
  const windowWidth = useWindowWidth();
  return (
    <div className="grid grid-cols-5 h-[1000px] ">
      {windowWidth >= 1100 && (
        <div className="sidebar flex justify-center col-span-1">
          <Sidebar />
        </div>
      )}
      <div className="content md:col-span-4  col-span-5">
        <div className=" w-full lg:w-3/4   my-0 m-auto"></div>
      </div>
    </div>
  );
};

export default SavedPosts;
