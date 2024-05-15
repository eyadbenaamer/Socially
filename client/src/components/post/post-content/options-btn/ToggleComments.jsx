import { useContext } from "react";
import { useSelector } from "react-redux";

import { PostContext } from "components/post";

import axiosClient from "utils/AxiosClient";

import { ReactComponent as CommentsEnabledIcon } from "assets/icons/comments.svg";
import { ReactComponent as CommentsDisabledIcon } from "assets/icons/comments-turnedoff.svg";

const ToggleComments = () => {
  const {
    setPost,
    creatorId: id,
    _id: postId,
    isCommentsDisabled,
  } = useContext(PostContext);

  const toggleComments = () => {
    axiosClient
      .patch(`/post/toggle_comments?userId=${id}&postId=${postId}`)
      .then(() =>
        setPost((prev) => ({
          ...prev,
          isCommentsDisabled: !isCommentsDisabled,
        }))
      );
  };
  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => toggleComments()}
      >
        <span className="w-6 ">
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
