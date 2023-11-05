import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "../../components/sidebar";
import { Content } from "./content";
import Following from "./following";

const Home = () => {
  const windowWidth = useWindowWidth();
  return (
    <div className="grid grid-cols-5 h-[1000px] ">
      {windowWidth >= 1100 && (
        <div className="sidebar flex justify-center col-span-1">
          <Sidebar />
        </div>
      )}
      <div className="content md:col-span-3  col-span-5">
        <div className=" w-full lg:w-3/4   my-0 m-auto">
          <Content />
        </div>
      </div>
      {windowWidth >= 768 && (
        <div className="conacts md:col-span-1 lg:col-span-1">
          <Following />
        </div>
      )}
    </div>
  );
};
export default Home;
