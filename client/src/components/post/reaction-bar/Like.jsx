import { useState } from "react";
import { ReactComponent as LikeIcon } from "../../../assets/icons/like.svg";
import { useSelector } from "react-redux";
import Dialog from "components/Dialog";
import WhoLiked from "./WhoLiked";
import convertNumber from "utils/convertNumber";
const Like = (props) => {
  const { id, creatorId } = props;
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState(props.likes);
  const [isLiked, setIsliked] = useState(likes.includes(user._id));
  const [showLikes, setShowLikes] = useState(false);
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
    }).then(
      (resolved) => {
        resolved.json().then((response) => setLikes(response.likes));
      },
      () => {
        setIsliked((prev) => !prev);
        setLikes((prev) => {
          if (isLiked) {
            prev.length += 1;
          } else {
            prev.length -= 1;
          }
          return prev;
        });
      }
    );
  };

  return (
    <div className=" flex w-auto justify-center  gap-2 items-center transition">
      <button className="w-6 " onClick={likeToggle}>
        {
          <LikeIcon
            style={{ transition: "3 fill" }}
            fill={isLiked ? "red" : "none"}
          />
        }
      </button>
      <button
        className={
          likes.length > 0
            ? "hover:underline text-hovered cursor-pointer transition"
            : ""
        }
        onClick={() => likes.length > 0 && setShowLikes(!showLikes)}
      >
        {convertNumber(likes.length)} {likes.length === 1 ? "like" : "likes"}
      </button>
      <Dialog isOpened={showLikes} setIsOpened={setShowLikes}>
        <WhoLiked likes={likes} />
      </Dialog>
    </div>
  );
};
export default Like;
