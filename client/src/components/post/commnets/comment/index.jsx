import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import useFetchProfile from "hooks/useFetchProfile";
import useGetTime from "hooks/useGetTime";

import Replies from "./replies";
import OptionsBtn from "./options-btn";
import Media from "./Media";

import { PostContext } from "components/post";
import UserPicture from "components/UserPicture";
import AddComment from "components/post/AddComment";
import Like from "components/post/reactions-bar/Like";
import Text from "components/Text";

import convertToUnit from "utils/convertToUnit";

import { ReactComponent as CommentIcon } from "assets/icons/comments.svg";

const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
  } = props;
  const [searchParams] = useSearchParams();
  const replyId = searchParams.get("replyId");

  const post = useContext(PostContext);
  const myProfile = useSelector((state) => state.profile);
  const [postCreatorProfile] = useFetchProfile(creatorId);
  const currentUser = useSelector((state) => state.profile);
  const [isModifying, setIsModifying] = useState(false);
  const [showReplies, setShowReplies] = useState(Boolean(replyId));
  const time = useGetTime(createdAt);

  return (
    <>
      {props.comment && postCreatorProfile && (
        <div className="flex flex-col gap-2 rounded-xl items-start justify-start">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-start">
              <span className="w-12">
                <UserPicture profile={postCreatorProfile} />
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex  items-center gap-2">
                      <div
                        className={`bg-300 rounded-xl shadow-md w-fit px-3 py-2`}
                      >
                        <Link
                          to={`/profile/${postCreatorProfile.username}`}
                          className="hover:underline"
                        >
                          {postCreatorProfile.firstName}{" "}
                          {postCreatorProfile.lastName}
                        </Link>
                        <Text
                          postCreatorId={post.creatorId}
                          text={text}
                          type="comment"
                          postId={post._id}
                          commentId={id}
                          isModifying={isModifying}
                          setIsModifying={setIsModifying}
                        />
                      </div>
                      <OptionsBtn
                        commentId={id}
                        commentCreatorId={creatorId}
                        setIsModifying={setIsModifying}
                        id={id}
                      />
                    </div>
                    <Media>
                      <div className="rounded-xl overflow-hidden w-fit">
                        {file && file.fileType === "photo" && (
                          <img src={file.path} alt="" />
                        )}
                        {file && file.fileType === "video" && (
                          <video controls src={file.path} />
                        )}
                      </div>
                    </Media>
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-start">
                  <Like
                    likes={likes}
                    type="comment"
                    userId={post.creatorId}
                    postId={post._id}
                    commentId={id}
                  />
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-1 text-hovered transition text-slate-400"
                  >
                    <CommentIcon width={24} />
                    {convertToUnit(replies.length)}
                  </button>
                  <span className="block text-xs text-slate-400">{time}</span>
                </div>
                {showReplies && (
                  <div className="-ms-5">
                    {replies && (
                      <Replies
                        commentCreator={postCreatorProfile}
                        replies={replies}
                      />
                    )}
                    <div className="-ms-6">
                      {(!post.isCommentsDisabled ||
                        myProfile?._id === post.creatorId) &&
                        currentUser && (
                          <AddComment type="reply" commentId={id} />
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
