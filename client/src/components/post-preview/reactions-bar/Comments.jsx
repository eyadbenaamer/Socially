import { useWindowWidth } from "hooks/useWindowWidth";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comments.svg";
import convertNumber from "utils/convertNumber";
import { Link } from "react-router-dom";
const Comments = (props) => {
  const { creatorId, id, commentsCount } = props;
  const windowWidth = useWindowWidth();
  return (
    <Link
      to={`/post/${creatorId}/${id}`}
      className="flex justify-center gap-2 w-fit text-hovered outline-none focus:stroke-[var(--primary-color)] stroke-current"
    >
      <CommentIcon className="w-6 stroke-inherit" />
      {windowWidth > 100 && (
        <div className="hover:underline">
          {convertNumber(commentsCount)}{" "}
          {commentsCount === 1 ? "Comment" : "Comments"}
        </div>
      )}
    </Link>
  );
};
export default Comments;
