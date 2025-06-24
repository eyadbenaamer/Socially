import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";

import WhoLiked from "./WhoLiked";

import Dialog from "components/dialog";

import convertToUnit from "utils/convertToUnit";
import axiosClient from "utils/AxiosClient";

import animationData from "assets/icons/like.json";
import { ReactComponent as LikeIcon } from "assets/icons/like.svg";

const Like = (props) => {
  const { type, userId, postId, commentId, replyId } = props;
  const profile = useSelector((state) => state.profile);
  const [likes, setLikes] = useState(props.likes);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLiked, setIsliked] = useState(
    Boolean(likes.find((like) => like._id === profile?._id))
  );
  const [showLikes, setShowLikes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const options = {
    loop: false,
    ariaRole: "icon-hover",
    autoplay: true,
    animationData,
  };

  const likeToggle = async () => {
    if (!profile || isLoading) return;

    setIsLoading(true);
    setFirstLoad(false);

    // Store original state for potential rollback
    const originalLikes = [...likes];
    const originalIsLiked = isLiked;

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsliked(newIsLiked);

    if (newIsLiked) {
      // Adding like
      setLikes((prev) => [...prev, profile._id]);
    } else {
      // Removing like
      setLikes((prev) => prev.filter((id) => id !== profile._id));
    }

    // Make API request
    let url;
    if (type === "post") {
      url = `post/like-toggle?userId=${userId}&postId=${postId}`;
    } else if (type === "comment") {
      url = `comment/like-toggle?userId=${userId}&postId=${postId}&commentId=${commentId}`;
    } else {
      url = `reply/like-toggle?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`;
    }

    try {
      const response = await axiosClient.patch(url);
      // Update with server response
      setLikes(response.data.likes);
      setIsliked(
        Boolean(response.data.likes.find((like) => like._id === profile._id))
      );
    } catch (error) {
      // Rollback on error
      setLikes(originalLikes);
      setIsliked(originalIsLiked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className={` flex w-auto justify-center gap-2 items-center transition ${
          type !== "post" ? "scale-90" : ""
        }`}
      >
        <div className="relative">
          <div
            className="md:cursor-pointer absolute top-0 left-0 z-10 h-full w-full"
            onClick={() => {
              if (profile) {
                likeToggle();
              } else {
                navigate("/login");
              }
            }}
          ></div>
          <div className="w-8 scale-[3]">
            {isLiked && !firstLoad ? (
              <Lottie options={options} ariaRole="" />
            ) : (
              <LikeIcon color={`${isLiked ? "#e53935" : "transparent"}`} />
            )}
          </div>
        </div>
        <div className="w-18">
          {likes.length > 0 ? (
            <button
              className={"relative z-10 link"}
              onClick={() => setShowLikes(!showLikes)}
            >
              {convertToUnit(likes.length)}{" "}
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
