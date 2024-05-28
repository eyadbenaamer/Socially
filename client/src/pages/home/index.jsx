import Following from "./following";

import { Content } from "./content";
import Sidebar from "components/sidebar";
import Bar from "components/bar";

import { useWindowWidth } from "hooks/useWindowWidth";
import { useSelector } from "react-redux";

const Home = () => {
  const windowWidth = useWindowWidth();
  const following = useSelector((state) => state.profile.following);
  return (
    <>
      <div className="grid grid-cols-8 pt-5 pb-28 min-h-screen">
        {windowWidth >= 768 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-8 md:mx-0 md:col-span-6 lg:col-span-4 col-span-8">
          <h1 className="text-2xl p-4 sticky top-[62px] bg-100 z-30">Home</h1>
          <div className="my-0 mx-auto">
            <Content />
          </div>
        </div>
        {following?.length > 0 && windowWidth >= 768 && (
          <div className="conacts sm:col-span-3 md:col-span-3 lg:col-span-2 ">
            <Following />
          </div>
        )}
      </div>
      {windowWidth <= 768 && <Bar />}
    </>
  );
};
export default Home;
