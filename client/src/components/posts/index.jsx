import { useState, useEffect, useRef, createContext, useContext } from "react";

import Post from "components/post";
import CreatePost from "components/create-post";
import LoadingPost from "./LoadingPost";
import NoConnectionMessage from "./NoConnectionMessage";

import axiosClient from "utils/AxiosClient";
import { ProfileContext } from "pages/profile";

export const PostsContext = createContext();

const Posts = () => {
  const username = useContext(ProfileContext)?.username;
  const userId = useContext(ProfileContext)?._id;

  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [posts, setPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(2);
  const [isFetching, setIsFetching] = useState(false);

  const postsEnd = useRef();

  const fetchPosts = () => {
    if (isFetching) return;

    setIsFetching(true);
    const requestURL = userId
      ? `posts/user?userId=${userId}&page=${currentPage}`
      : `posts?page=${currentPage}`;

    axiosClient
      .get(requestURL)
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setCurrentPage((prevPage) => prevPage + 1);
        setPosts((prev) =>
          prev ? [...prev, ...response.data.posts] : [...response.data.posts]
        );
      })
      .catch(() => {
        setMessage("An error occurred. please try again later.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  // fetch posts once after loading the page
  useEffect(() => {
    const requestURL = userId
      ? `posts/user?userId=${userId}&page=1`
      : `posts?page=1`;

    setIsFetching(true);
    axiosClient
      .get(requestURL)
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setCurrentPage(2);
        setPosts(response.data.posts);
      })
      .catch(() => {
        setMessage("An error occurred. please try again later.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [username]);

  // scroll listener to fetch next page
  useEffect(() => {
    const updatePage = () => {
      const postsEndLocation = Math.floor(postsEnd.current?.offsetTop || 0);
      const scroll = Math.floor(window.scrollY + window.innerHeight);

      if (scroll >= postsEndLocation / 2) {
        if (currentPage <= totalPages && !isFetching) {
          fetchPosts();
          window.removeEventListener("scrollend", updatePage);
        }
      }
    };

    window.addEventListener("scrollend", updatePage);
    return () => window.removeEventListener("scrollend", updatePage);
  }, [currentPage, totalPages, isFetching]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      <div className="flex flex-col gap-y-4 items-center">
        <CreatePost />

        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {currentPage <= totalPages && (
          <div className="w-full" ref={postsEnd}>
            <LoadingPost />
          </div>
        )}

        {posts?.length === 0 && <>No posts</>}

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
