import Post from "components/post";
import { useEffect, useRef } from "react";
import { useState } from "react";

const Posts = (props) => {
  const { id, createdPost } = props;
  const [postsCollection, setPostsCollection] = useState(0);
  const [message, setMessage] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [posts, setPosts] = useState(null);
  const lastPost = useRef(null);

  const fetchPosts = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const requestURL = id
      ? `${API_URL}/posts?userId=${id}`
      : `${API_URL}/posts`;
    fetch(requestURL).then(async (response) => {
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
              post={post}
            />
          );
        })}
      {isFetched && posts && posts.length === 0 && <>No posts.</>}
      <>{message}</>
    </div>
  );
};
export default Posts;
