import { useContext } from "react";
import Comment from "./comment";
import { PostContext } from "..";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const Comments = () => {
  const { comments, _id: postId } = useContext(PostContext);
  const { commentId } = useParams();
  useEffect(() => {
    if (commentId && document.querySelector(`#e${commentId}`)) {
      document.querySelector(`#e${commentId}`).focus();
    }
  }, [comments]);
  return (
    <div className="flex flex-col gap-5 border-t-[#ffffff1a] border-t p-3">
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <div
              className="radius"
              tabIndex={0}
              id={
                commentId && commentId === comment._id ? "e" + commentId : null
              }
            >
              <Comment postId={postId} key={comment._id} comment={comment} />
            </div>
          ))}
        </>
      ) : (
        <>No comments.</>
      )}
    </div>
  );
};

export default Comments;
