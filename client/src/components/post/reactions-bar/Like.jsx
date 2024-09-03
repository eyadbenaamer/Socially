import { useState } from "react";
import { useSelector } from "react-redux";
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
    likes.includes(profile ? profile._id : false)
  );
  const [showLikes, setShowLikes] = useState(false);
  const options = {
    loop: false,
    ariaRole: "icon-hover",
    autoplay: true,
    animationData,
  };

  const likeToggle = async () => {
    setFirstLoad(false);
    if (profile) {
      //updating likes for user before making a request
      setIsliked((prev) => !prev);
      if (!isLiked) {
        setLikes((prev) => {
          prev.push(profile._id);
          return prev;
        });
      } else {
        setLikes((prev) => {
          prev.filter((item) => item != profile._id);
          return prev;
        });
      }
      // makeing a request to update like status, if it failed then the likes will be restored
      let url;
      if (type === "post") {
        url = `post/like-toggle?userId=${userId}&postId=${postId}`;
      } else if (type === "comment") {
        url = `comment/like-toggle?userId=${userId}&postId=${postId}&commentId=${commentId}`;
      } else {
        url = `reply/like-toggle?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`;
      }
      axiosClient
        .patch(url)
        .then((response) => {
          setLikes(response.data.likes);
        })
        .catch(() => {
          //if error eccoured restores likes
          setIsliked((prev) => !prev);
          if (!isLiked) {
            setLikes((prev) => {
              prev.push(profile._id);
              return prev;
            });
          } else {
            setLikes((prev) => {
              prev.filter((item) => item != profile._id);
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
        <div className="relative">
          <div
            className="md:cursor-pointer absolute top-0 left-0 z-10 h-full w-full"
            onClick={likeToggle}
          ></div>
          <div className=" w-8 scale-[3]">
            {isLiked && !firstLoad ? (
              <Lottie options={options} ariaRole="" />
            ) : (
              <LikeIcon
                color={`${
                  likes.includes(profile ? profile._id : "")
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
