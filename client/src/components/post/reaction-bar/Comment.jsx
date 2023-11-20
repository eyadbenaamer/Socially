import { useWindowWidth } from "hooks/useWindowWidth";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comments.svg";
const Comment = (props) => {
  const windowWidth = useWindowWidth();

  return (
    <div className="flex w-1/3 justify-center py-4 gap-1 items-center text-hovered transition cursor-pointer">
      <div className="w-6">
        <CommentIcon />
      </div>
      {windowWidth > 400 && <span>Comment</span>}
    </div>
  );
};
export default Comment;
