import { useContext } from "react";
import { ReactComponent as CommentsEnabledIcon } from "../../../../assets/icons/comments.svg";
import { ReactComponent as CommentsDisabledIcon } from "../../../../assets/icons/comments-turnedoff.svg";
import { useSelector } from "react-redux";
import { PostContext } from "components/post-preview";

const ToggleComments = () => {
  const {
    isCommentsDisabled,
    creatorId,
    setPost,
    _id: postId,
  } = useContext(PostContext);

  const user = useSelector((state) => state.user);

  const toggleComments = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/posts/toggle_comments/${creatorId}/${postId}`, {
      method: "PATCH",
      headers: { Authorization: user.token },
    }).then((response) =>
      response.json().then(() => {
        setPost((prev) => ({
          ...prev,
          isCommentsDisabled: !isCommentsDisabled,
        }));
      })
    );
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
            <CommentsDisabledIcon />
          )}
        </span>
        {isCommentsDisabled ? "Turn on comments" : "Turn off comments"}
      </button>
    </li>
  );
};

export default ToggleComments;
