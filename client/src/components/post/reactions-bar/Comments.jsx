import { useWindowWidth } from "hooks/useWindowWidth";
import { ReactComponent as CommentIcon } from "assets/icons/comments.svg";
import convertNumber from "utils/convertNumber";
import { useContext } from "react";
import { PostContext } from "..";
const Comments = () => {
  const { isCommentsDisabled, comments, setShowComments, commentInput } =
    useContext(PostContext);
  const windowWidth = useWindowWidth();
  return (
    <div className="flex w-auto justify-center gap-2 items-center transition ">
      <button
        aria-label="write a comment"
        disabled={isCommentsDisabled}
        onClick={() => {
          setShowComments(true);
          if (commentInput.current) {
            commentInput.current.focus();
          }
        }}
        className={`flex w-full gap-1 outline-none transition
        ${!isCommentsDisabled ? "hover:text-[var(--primary-color)]" : ""}`}
      >
        <CommentIcon className="w-6" />
        {windowWidth > 100 && (
          <>
            {convertNumber(comments.length)}{" "}
            {comments.length === 1 ? "Comment" : "Comments"}
          </>
        )}
      </button>
    </div>
  );
};
export default Comments;
