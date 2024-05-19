import { useState, useEffect, useRef, createContext } from "react";

import Post from "components/post";

import axiosClient from "utils/AxiosClient";
import CreatePost from "components/create-post";
import LoadingPost from "./LoadingPost";
import NoConnectionMessage from "./NoConnectionMessage";

export const PostsContext = createContext();

const Posts = (props) => {
  const { id } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [posts, setPosts] = useState(null);

  const postsEnd = useRef();

  const [totalPages, setTotalPages] = useState(2);

  const fetchPosts = () => {
    const requestURL = id
      ? `posts/user?userId=${id}&page=${currentPage}`
      : `posts`;
    axiosClient
      .get(requestURL)
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setCurrentPage(currentPage + 1);
        setPosts((prev) => {
          if (prev) {
            prev = [...prev, ...response.data.posts];
          } else {
            prev = [...response.data.posts];
          }
          return prev;
        });
      })
      .catch(() => {
        setMessage("An error occurred. please try again later.");
      });
  };
  // fetch posts once after loading the page
  useEffect(() => {
    fetchPosts();
  }, []);
  /*
  fetch posts whenever scrolling reaches to the half distance between the 
  first and the last loaded post, i.e: having 10 posts, when scrolling reaches 
  to the 5th posts, the new page of posts being requested 
  */
  useEffect(() => {
    const updatePage = () => {
      const postsEndLocation = Math.floor(postsEnd.current?.offsetTop);
      const scroll = Math.floor(window.scrollY + window.screen.height);
      if (scroll >= postsEndLocation / 2) {
        if (currentPage <= totalPages) {
          fetchPosts();
          window.removeEventListener("scrollend", updatePage);
        }
      }
    };
    window.addEventListener("scrollend", updatePage);
    return () => window.removeEventListener("scrollend", updatePage);
  }, [currentPage]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      <div className="flex flex-col gap-y-4 items-center">
        {/* post creation area */}
        <CreatePost />
        {/* posts area */}
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
        {/* the loading component appears only when there is more pages */}
        {currentPage <= totalPages && (
          <div className="w-full" ref={postsEnd}>
            <LoadingPost />
          </div>
        )}

        {posts?.length === 0 && <>No posts.</>}

        {/* message component appears the posts request fails */}
        {message && currentPage <= totalPages && (
          <NoConnectionMessage
            onClick={() => {
              setMessage("");
              fetchPosts();
            }}
            message={message}
          />
        )}
      </div>
    </PostsContext.Provider>
  );
};
export default Posts;
