import { useState } from "react";
import { ReactComponent as LikeIcon } from "../../../assets/icons/like.svg";
import { useSelector } from "react-redux";
import axios from "axios";
const Like = (props) => {
  const { id, creatorId } = props;
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState(props.likes);
  const [isLiked, setIsliked] = useState(likes.includes(user._id));
  const likeToggle = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    setIsliked((prev) => !prev);
    setLikes((prev) => {
      if (!isLiked) {
        prev.length += 1;
      } else {
        prev.length -= 1;
      }
      return prev;
    });
    fetch(`${API_URL}/posts/post_like_toggle/${creatorId}/${id}`, {
      method: "PATCH",
      headers: { authorization: user.token },
    }).then(null, () => {
      setIsliked((prev) => !prev);
      setLikes((prev) => {
        if (isLiked) {
          prev.length += 1;
        } else {
          prev.length -= 1;
        }
        return prev;
      });
    });
  };
  return (
    <div className=" flex w-1/3 justify-center p-4 gap-1 items-center cursor-pointer transition">
      <div className="w-6" onClick={likeToggle}>
        {
          <LikeIcon
            style={{ transition: "3 fill" }}
            fill={isLiked ? "red" : "none"}
          />
        }
      </div>
      <span className="hover:underline">{likes.length}</span>
    </div>
  );
};
export default Like;
