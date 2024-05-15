import { useState, useEffect, useRef, createContext } from "react";

import Post from "components/post";

import axiosClient from "utils/AxiosClient";
import CreatePost from "components/create-post";

export const PostsContext = createContext();

const Posts = (props) => {
  const { id } = props;
  const [postsPage, setPostsPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [posts, setPosts] = useState(null);
  const lastPost = useRef(null);

  const fetchPosts = () => {
    const requestURL = id
      ? `posts/user?userId=${id}&page=${postsPage}`
      : `posts`;
    axiosClient
      .get(requestURL)
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((err) => {
        setMessage("An error occurred. please try again later.");
      });
  };
  window.addEventListener("scroll", () => {
    if (window.scrollY === lastPost.current?.offsetTop) {
      setPostsPage(postsPage + 1);
    }
  });
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {}, [lastPost.current]);
  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      <div className="flex flex-col gap-y-4 items-center">
        <CreatePost />
        {posts?.map((post, index) => {
          return (
            <Post
              key={post._id}
              ref={index === 4 ? lastPost : null}
              post={post}
            />
          );
        })}
        {posts?.length === 0 && <>No posts.</>}
        <>{message}</>
      </div>
    </PostsContext.Provider>
  );
};
export default Posts;
