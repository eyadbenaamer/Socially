import Post from "components/post";
import { useEffect, useRef } from "react";
import { useState } from "react";

const Posts = ({ id, createdPost }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [postsCollection, setPostsCollection] = useState(0);
  const [message, setMessage] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [posts, setPosts] = useState([]);
  const lastPost = useRef(null);
  const fetchPosts = async () => {
    await fetch(`${API_URL}/posts/${id ? id : ""}`).then(async (response) => {
      if (response.status === 200) {
        setPosts(await response.json());
        setIsFetched(true);
      } else {
        setIsFetched(true);
        setMessage("An error occurred. please try again later.");
      }
    });
  };
  useEffect(() => {
    fetchPosts().catch(() => setMessage("Couldn't retrieve posts."));
  }, [createdPost]);
  return (
    <div className="flex flex-col gap-y-4 items-center">
      {isFetched &&
        posts &&
        posts.length > 0 &&
        posts.map((post, index) => {
          return (
            <Post
              key={post._id}
              // ref={index === posts.length - 1 ? lastPost : null}
              ref={lastPost}
              data={post}
            />
          );
        })}
      {isFetched && posts && posts.length === 0 && <>No posts.</>}
      <>{message}</>
    </div>
  );
};
export default Posts;
