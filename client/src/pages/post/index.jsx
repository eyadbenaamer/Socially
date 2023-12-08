import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./commnets";
import AddComment from "pages/post/AddComment";
import Bar from "components/bar";
import { useWindowWidth } from "hooks/useWindowWidth";
import PostContent from "./post-content";
import ReactionsBar from "./reactions-bar";
import { useSelector } from "react-redux";

export const PostContext = createContext();

const Post = () => {
  const { userId, postId, commentId } = useParams();
  const [post, setPost] = useState(null);
  const windowWidth = useWindowWidth();
  useEffect(() => {
    // window.scrollTo({ top: -1000 });
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/posts/${userId}/${postId}`).then((response) =>
      response.json().then((response) => {
        setPost(response);
      })
    );
  }, []);

  const user = useSelector((state) => state.user);
  return (
    <>
      <div className="p-2 w-full md:w-1/2 lg:w-2/5 py-5 mx-auto min-h-screen pt-5 pb-20">
        {post && (
          <div className="bg-200 radius shadow-sm">
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
                    {user && user._id === userId
                      ? "You had"
                      : "The post creator has"}{" "}
                    turned off the comments.
                  </div>
                ))}
            </PostContext.Provider>
          </div>
        )}
      </div>
      {windowWidth <= 768 && <Bar />}
    </>
  );
};

export default Post;
