import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";
import CreatePost from "components/create-post";
import Posts from "components/posts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const windowWidth = useWindowWidth();
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const [createdPost, setCreatedPost] = useState(null);
  //TODO: find a way to refresh the posts when the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getUser = async () => {
      let user = await axios
        .get(`${process.env.REACT_APP_API_URL}/profile/${id}`)
        .then((response) => {
          return response.data;
        });
      setUser(user);
    };
    getUser();
  }, [id]);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-3/5">
        <section className="content flex flex-col px-4 gap-3 w-full lg:w-3/4  my-0 m-auto">
          <CreatePost setCreatedPost={setCreatedPost} />
          {user && <Posts id={user._id} createdPost={createdPost} />}
        </section>
      </div>
    </div>
  );
};

export default Profile;
