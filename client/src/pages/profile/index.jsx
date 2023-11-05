import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";
import CreatePost from "components/create-post";
import Posts from "components/posts";
import { useSelector } from "react-redux";

const Profile = () => {
  const windowWidth = useWindowWidth();
  const user = useSelector((state) => state.user);
  return (
    <div className="flex flex-col items-center  h-[1000px] ">
      <div className="w-full md:w-3/5">
        <section className="content flex flex-col px-4 gap-3 w-full lg:w-3/4  my-0 m-auto">
          <CreatePost />
          <Posts id={user._id} />
        </section>
      </div>
    </div>
  );
};

export default Profile;
