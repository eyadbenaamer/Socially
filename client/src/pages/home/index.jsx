import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "../../components/sidebar";
import { Content } from "./content";
import Following from "./following";
import Bar from "components/bar";

const Home = () => {
  // window.scrollTo({ top: -100, behavior: "smooth" });
  const windowWidth = useWindowWidth();

  return (
    <>
      <div className="grid grid-cols-8 pt-5 pb-20 min-h-screen">
        {windowWidth > 768 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-5 lg:col-span-4 col-span-8">
          <div className=" w-full md:w-4/5 my-0 m-auto">
            <Content />
          </div>
        </div>
        {windowWidth >= 768 && (
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
