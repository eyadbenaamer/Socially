import Following from "./following";

import { Content } from "./content";
import Sidebar from "components/sidebar";

import { useWindowWidth } from "hooks/useWindowWidth";
import { useSelector } from "react-redux";

const Home = () => {
  const windowWidth = useWindowWidth();
  const following = useSelector((state) => state.profile.following);
  return (
    <>
      <div className="grid grid-cols-10 pt-5 pb-28">
        {windowWidth >= 1024 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-10 md:mx-0 lg:col-span-6 col-span-10">
          <h1 className="text-2xl p-4 sticky top-[45px] bg-100 z-30">Home</h1>
          <div className="my-0 mx-auto">
            <Content />
          </div>
        </div>
        {following?.length > 0 && windowWidth >= 1024 && (
          <div className="conacts col-span-2 ">
            <Following />
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
