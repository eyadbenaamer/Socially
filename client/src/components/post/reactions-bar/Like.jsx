import { useState } from "react";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";

import WhoLiked from "./WhoLiked";

import Dialog from "components/Dialog";

import convertNumber from "utils/convertNumber";

import animationData from "assets/icons/like.json";
import { ReactComponent as LikeIcon } from "assets/icons/like.svg";

const Like = (props) => {
  const { type, userId, postId, commentId, replyId } = props;
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState(props.likes);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLiked, setIsliked] = useState(
    likes.includes(user ? user._id : false)
  );
  const [showLikes, setShowLikes] = useState(false);
  const options = {
    loop: false,
    ariaRole: "icon",
    autoplay: true,
    animationData,
  };

  const likeToggle = async () => {
    setFirstLoad(false);
    const API_URL = process.env.REACT_APP_API_URL;
    if (user) {
      //updating likes for user before making a request
      setIsliked((prev) => !prev);
      if (!isLiked) {
        setLikes((prev) => {
          prev.push(user._id);
          return prev;
        });
      } else {
        setLikes((prev) => {
          prev.filter((item) => item != user._id);
          return prev;
        });
      }
      // makeing a request to update like status, if it failed then the likes will be restored
      let url;
      if (type === "post") {
        url = `${API_URL}/post/like?userId=${userId}&postId=${postId}`;
      } else if (type === "comment") {
        url = `${API_URL}/comment/like?userId=${userId}&postId=${postId}&commentId=${commentId}`;
      } else {
        url = `${API_URL}/reply/like?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`;
      }
      fetch(url, {
        method: "PATCH",
        headers: { authorization: user.token },
      })
        .then((resolved) => {
          resolved.json().then((response) => setLikes(response.likes));
        })
        .catch(() => {
          //if error eccoured restores likes
          setIsliked((prev) => !prev);
          if (!isLiked) {
            setLikes((prev) => {
              prev.push(user._id);
              return prev;
            });
          } else {
            setLikes((prev) => {
              prev.filter((item) => item != user._id);
              return prev;
            });
          }
        });
    }
  };
  return (
    <div>
      <div
        className={` flex w-auto justify-center gap-2 items-center transition ${
          type !== "post" ? "scale-90" : ""
        }`}
      >
        <div
          tabIndex={0}
          className="w-8 md:cursor-pointer"
          onClick={likeToggle}
        >
          <div style={{ transform: "scale(3)" }}>
            {isLiked && !firstLoad ? (
              <Lottie options={options} ariaRole="" />
            ) : (
              <LikeIcon
                color={`${
                  likes.includes(user ? user._id : "")
                    ? "#e53935"
                    : "transparent"
                }`}
              />
            )}
          </div>
        </div>
        <div className="w-12">
          {likes.length > 0 ? (
            <button
              className={
                "z-10 hover:underline hover:text-[var(--primary-color)] transition"
              }
              onClick={() => setShowLikes(!showLikes)}
            >
              {convertNumber(likes.length)}{" "}
              {type === "post" ? (likes.length === 1 ? "like" : "likes") : ""}
            </button>
          ) : (
            <>0 {type === "post" ? "likes" : ""}</>
          )}
        </div>
      </div>
      <Dialog isOpened={showLikes} setIsOpened={setShowLikes}>
        <WhoLiked setIsOpened={setShowLikes} likes={likes} />
      </Dialog>
    </div>
  );
};
export default Like;
