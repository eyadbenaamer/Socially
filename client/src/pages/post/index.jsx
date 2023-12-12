import { createContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Comments from "./commnets";
import AddComment from "pages/post/AddComment";
import Bar from "components/bar";
import { useWindowWidth } from "hooks/useWindowWidth";
import PostContent from "./post-content";
import ReactionsBar from "./reactions-bar";
import { useSelector } from "react-redux";
import NotFound from "pages/NotFound";

export const PostContext = createContext();

const Post = () => {
  const { userId, postId, commentId } = useParams();
  const [post, setPost] = useState(null);
  const windowWidth = useWindowWidth();
  useEffect(() => {
    // window.scrollTo({ top: -1000 });
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/posts/${userId}/${postId}`).then((response) => {
      if (response.status === 200) {
        response.json().then((response) => {
          setPost(response);
        });
      } else {
        setPost("not found");
      }
    });
  }, []);

  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.settings.mode);
  return (
    <>
      {post === "not found" ? (
        <NotFound />
      ) : (
        <div className="p-2 w-full md:w-1/2 lg:w-2/5 py-5 mx-auto min-h-screen pt-5 pb-20">
          {post && (
            <div
              className={`bg-200 radius shadow-md ${
                mode === "light" ? "border" : ""
              }`}
            >
              <PostContext.Provider
                value={{
                  ...post,
                  setPost,
                }}
              >
                <div className="flex flex-col gap-4 bg-200 radius w-full py-3">
                  <PostContent />
                  <ReactionsBar />
                </div>
                <Comments />
                {user &&
                  (post.isCommentsDisabled === false ? (
                    <AddComment />
                  ) : (
                    <div className="text-center p-4 bg-300 radius ">
                      {user && user._id === userId ? "You" : "The post creator"}{" "}
                      turned off the comments.
                    </div>
                  ))}
              </PostContext.Provider>
            </div>
          )}
        </div>
      )}
      {windowWidth <= 768 && user && <Bar />}
    </>
  );
};

export default Post;
