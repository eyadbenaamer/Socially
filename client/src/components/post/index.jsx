import { createContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Comments from "./commnets";
import PostContent from "./post-content";
import ReactionsBar from "./reactions-bar";
import AddComment from "./AddComment";

import SharedPost from "components/SharedPost";

import "./index.css";

export const PostContext = createContext();

export const Post = (props) => {
  const { creatorId } = props.post;
  const [post, setPost] = useState(props.post);
  const [showComments, setShowComments] = useState(props.showComments);

  const profile = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.settings.theme);

  const commentInput = useRef();
  return (
    <div className="w-full">
      {post && (
        <div
          className={`bg-200 rounded-xl shadow-md ${
            theme === "light" ? "border" : ""
          }`}
        >
          <PostContext.Provider
            value={{
              ...post,
              setPost,
              setShowComments,
              commentInput,
            }}
          >
            <div className="flex flex-col gap-4 bg-200 rounded-xl w-full py-3">
              <PostContent />
              {post.sharedPost && <SharedPost post={post.sharedPost} />}
              <ReactionsBar />
            </div>
            {showComments && (
              <div
                className={`flex flex-col gap-4 p-3 items-start ${
                  theme === "dark"
                    ? "border-t-[#ffffff0f]"
                    : "border-t-[#0000000d]"
                } border-t`}
              >
                <Comments />
                <button className="transition hover:text-[var(--primary-color)] hover:underline underline-offset-2">
                  show more
                </button>
                {profile &&
                  (!post.isCommentsDisabled ||
                    profile._id === post.creatorId) && (
                    <AddComment type="comment" />
                  )}
                {post.isCommentsDisabled && profile?._id !== post.creatorId && (
                  <div className="text-center p-4 bg-300 rounded-xl w-full">
                    {profile && profile._id === creatorId
                      ? "You"
                      : "The post creator"}{" "}
                    turned off the comments.
                  </div>
                )}
              </div>
            )}
          </PostContext.Provider>
        </div>
      )}
    </div>
  );
};

export default Post;
