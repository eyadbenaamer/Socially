import { useWindowWidth } from "hooks/useWindowWidth";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comments.svg";
import convertNumber from "utils/convertNumber";
import { Link } from "react-router-dom";
import { useRef } from "react";
const Comments = (props) => {
  const { creatorId, id, commentsCount } = props;
  const windowWidth = useWindowWidth();
  const textAera = useRef();
  return (
    <div className="flex w-auto justify-center gap-2 items-center transition ">
      <button
        onClick={() => document.querySelector(".comment-input").focus()}
        className="w-6 text-hovered outline-none focus:stroke-[var(--primary-color)] stroke-current"
      >
        <CommentIcon className=" stroke-inherit" />
      </button>
      {windowWidth > 100 && (
        <Link
          to={`/post/${creatorId}/${id}`}
          className="text-hovered hover:underline"
        >
          {convertNumber(commentsCount)}{" "}
          {commentsCount === 1 ? "Comment" : "Comments"}
        </Link>
      )}
    </div>
  );
};
export default Comments;
