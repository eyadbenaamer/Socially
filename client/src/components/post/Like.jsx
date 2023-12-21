import { useState } from "react";
import { ReactComponent as LikeIcon } from "../../assets/icons/like.svg";
import { useSelector } from "react-redux";
import Dialog from "components/Dialog";
import WhoLiked from "./WhoLiked";
import Lottie from "react-lottie";
import animationData from "../../assets/icons/like.json";
import convertNumber from "utils/convertNumber";
const Like = (props) => {
  const { type, path } = props;
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState(props.likes);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLiked, setIsliked] = useState(
    likes.includes(user ? user._id : false)
  );
  const [showLikes, setShowLikes] = useState(false);
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const likeToggle = async () => {
    setFirstLoad(false);
    const API_URL = process.env.REACT_APP_API_URL;
    if (user) {
      setIsliked((prev) => !prev);
      setLikes((prev) => {
        if (!isLiked) {
          prev.length += 1;
        } else {
          prev.length -= 1;
        }
        return prev;
      });
      fetch(`${API_URL}/posts/like_${type}_toggle/${path}`, {
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
    } else {
      console.log("login first");
    }
  };

  return (
    <div>
      <div
        className={` flex w-auto justify-center gap-2 items-center transition ${
          type !== "post" ? "scale-90" : ""
        }`}
      >
        <button className={`w-8 `} onClick={likeToggle}>
          <div style={{ transform: "scale(3)" }}>
            {isLiked && !firstLoad ? (
              <Lottie options={defaultOptions} />
            ) : (
              <LikeIcon
                color={`${
                  props.likes.includes(user ? user._id : "")
                    ? "#e53935"
                    : "transparent"
                }`}
              />
            )}
          </div>
        </button>
        {likes.length > 0 ? (
          <button
            className={"z-10 hover:underline text-hovered transition"}
            onClick={() => setShowLikes(!showLikes)}
          >
            {convertNumber(likes.length)}{" "}
            {type === "post" ? (likes.length === 1 ? "like" : "likes") : ""}
          </button>
        ) : (
          <span>
            {likes.length} {type === "post" ? "likes" : ""}
          </span>
        )}
      </div>
      <Dialog isOpened={showLikes} setIsOpened={setShowLikes}>
        <WhoLiked setIsOpened={setShowLikes} likes={likes} />
      </Dialog>
    </div>
  );
};
export default Like;
