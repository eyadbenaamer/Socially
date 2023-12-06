import { useContext } from "react";
import { ReactComponent as CommentsEnabledIcon } from "../../../../assets/icons/comments.svg";
import { ReactComponent as CommentsDisabledIcon } from "../../../../assets/icons/comments.svg";
import { useSelector } from "react-redux";
import { PostContext } from "pages/post";

const ToggleComments = () => {
  const {
    isCommentsDisabled,
    setIsCommentsDisabled,
    creatorId: id,
    _id: postId,
  } = useContext(PostContext);

  const user = useSelector((state) => state.user);

  const toggleComments = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/posts/toggle_comments/${id}/${postId}`, {
      method: "PATCH",
      headers: { Authorization: user.token },
    }).then(() => setIsCommentsDisabled(!isCommentsDisabled));
  };
  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => toggleComments()}
      >
        <span className="w-6">
          {isCommentsDisabled ? (
            <CommentsEnabledIcon />
          ) : (
            <CommentsEnabledIcon />
          )}
        </span>
        {isCommentsDisabled ? "Turn on comments" : "Turn off comments"}
      </button>
    </li>
  );
};

export default ToggleComments;
