import { useEffect, useState } from "react";

import Layout from "layout";
import Post from "components/post";
import LoadingPost from "components/posts/LoadingPost";

import axiosClient from "utils/AxiosClient";
const SavedPosts = () => {
  const [posts, setPosts] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchSavedPosts = () => {
    setIsFetching(true);
    axiosClient(`saved_posts/`)
      .then((response) => setPosts(response.data))
      .catch(() => {})
      .finally(() => setIsFetching(false));
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl p-4 sticky top-[45px] bg-100 z-30 lg:w-4/5 center">
        Saved Posts
      </h1>
      {posts?.length === 0 && !isFetching && <>No posts.</>}
      {isFetching && <LoadingPost />}
      <div className="flex flex-col px-2 gap-3 justify-center lg:w-4/5 center">
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default SavedPosts;
