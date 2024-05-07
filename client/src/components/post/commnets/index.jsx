import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Comment from "./comment";

import { PostContext } from "..";

const Comments = () => {
  const { comments, _id: postId } = useContext(PostContext);
  const { userId, commentId, replyId } = useParams();
  const [searchedComment, setSearchedComment] = useState(null);
  useEffect(() => {
    if (comments) {
      if (!document.getElementById(commentId) && commentId) {
        const API_URL = process.env.REACT_APP_API_URL;
        fetch(
          `${API_URL}/comment?userId=${userId}&postId=${postId}&commentId=${commentId}`
        ).then((response) => {
          if (response.status === 200) {
            response.json().then((response) => {
              setSearchedComment(response);
            });
          }
        });
      }
    }
  }, [comments]);
  const focusedComment = useRef();
  useEffect(() => {
    if (commentId && !replyId) {
      if (focusedComment.current && !replyId) {
        window.scrollTo({ top: focusedComment.current.offsetTop - 200 });
        focusedComment.current.classList.add("focused");
      }
    }
  }, [focusedComment.current, commentId, replyId]);

  return (
    <div className={`flex flex-col gap-5`}>
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <div
              className={
                commentId === comment._id && !replyId ? "focused" : null
              }
              ref={comment._id === commentId ? focusedComment : null}
              id={comment._id}
            >
              <Comment postId={postId} key={comment._id} comment={comment} />
            </div>
          ))}
          {searchedComment && (
            <div ref={focusedComment}>
              <Comment postId={postId} comment={searchedComment} />
            </div>
          )}
        </>
      ) : (
        <>No comments.</>
      )}
    </div>
  );
};

export default Comments;
