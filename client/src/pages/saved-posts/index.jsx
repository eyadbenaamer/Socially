import { useEffect, useState } from "react";

import Layout from "layout";
import Post from "components/post";

import axiosClient from "utils/AxiosClient";

const SavedPosts = () => {
  const [posts, setPosts] = useState(null);

  const fetchSavedPosts = () => {
    axiosClient(`saved_posts/`)
      .then((response) => setPosts(response.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl py-4 sticky top-[45px] bg-100 z-30">
        Saved Posts
      </h1>
      {posts?.length === 0 && <>No posts.</>}
      <div className="flex flex-col gap-3 justify-center">
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default SavedPosts;
