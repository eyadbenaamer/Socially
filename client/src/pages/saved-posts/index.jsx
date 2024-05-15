import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Sidebar from "components/sidebar";
import Bar from "components/bar";
import Post from "components/post";

import { useWindowWidth } from "hooks/useWindowWidth";

import axiosClient from "utils/AxiosClient";

const SavedPosts = () => {
  const windowWidth = useWindowWidth();
  const [posts, setPosts] = useState(null);

  const fetchSavedPosts = () => {
    axiosClient(`saved_posts/`).then((response) => setPosts(response.data));
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-8 pt-5 pb-28 min-h-screen">
        {windowWidth >= 768 && (
          <div className="sidebar flex justify-center col-span-2">
            <Sidebar />
          </div>
        )}
        <div className="content sm:col-span-5 lg:col-span-4 col-span-8">
          <div className="flex flex-col px-2 gap-3 justify-center">
            {posts && posts.map((post) => <Post key={post._id} post={post} />)}
          </div>
        </div>
      </div>
      {windowWidth <= 768 && <Bar />}
    </>
  );
};

export default SavedPosts;
