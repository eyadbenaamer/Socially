import { useContext } from "react";
import Comment from "./comment";
import { PostContext } from "..";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Comments = () => {
  const { comments, _id: postId } = useContext(PostContext);
  const { commentId } = useParams();
  useEffect(() => {
    if (commentId && document.querySelector(`#targetComment`)) {
      let targetComment = document.querySelector(`#targetComment`);
      targetComment.focus();
      window.scrollTo({ top: targetComment.offsetTop + 1200 });
    }
  }, [comments]);
  const mode = useSelector((state) => state.settings.mode);
  return (
    <div
      className={`flex flex-col gap-5 ${
        mode === "dark" ? "border-t-[#ffffff1a]" : "border-t-[#f4f5f9]"
      } border-t p-3`}
    >
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <Comment postId={postId} key={comment._id} comment={comment} />
          ))}
        </>
      ) : (
        <>No comments.</>
      )}
    </div>
  );
};

export default Comments;
