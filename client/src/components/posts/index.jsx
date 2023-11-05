import Post from "components/post";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Posts = ({ id }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [postsCollection, setPostsCollection] = useState(0);
  const [message, setMessage] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [posts, setPosts] = useState([]);
  const lastPost = useRef(null);
  const fetchData = async () => {
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
    fetchData().catch(() => setMessage("Couldn't retrieve posts."));
  }, []);
  console.log(lastPost);
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
