import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import useFetchUser from "hooks/useFetchUser";

import Replies from "./replies";
import OptionsBtn from "./options-btn";
import Media from "./Media";

import useGetTime from "hooks/useGetTime";

import { PostContext } from "components/post";
import UserPicture from "components/UserPicture";
import AddComment from "components/post/AddComment";
import Like from "components/post/reactions-bar/Like";
import Text from "components/Text";

import { ReactComponent as CommentIcon } from "assets/icons/comments.svg";

const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
  } = props;
  const { replyId } = useParams();
  const post = useContext(PostContext);
  const [user] = useFetchUser(creatorId);
  const currentUser = useSelector((state) => state.profile);
  const [isModifying, setIsModifying] = useState(false);
  const [showReplies, setShowReplies] = useState(Boolean(replyId));
  const time = useGetTime(createdAt);
  return (
    <>
      {props.comment && user && (
        <div className="flex flex-col gap-2 rounded-xl items-start justify-start">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-start">
              <div className="flex">
                <UserPicture
                  id={user._id}
                  src={user.avatarPath}
                  name={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex  items-center gap-2">
                      <div
                        className={`bg-300 rounded-xl shadow-md w-fit px-3 py-2`}
                      >
                        <Link
                          to={`/profile/${user._id}`}
                          className="hover:underline"
                        >
                          {user.firstName} {user.lastName}
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
                    userId={creatorId}
                    postId={post._id}
                    commentId={id}
                  />
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-1 text-hovered transition text-slate-400"
                  >
                    <CommentIcon width={24} />
                    {replies.length}
                  </button>
                  <span className="block text-xs text-slate-400">{time}</span>
                </div>
                {showReplies && (
                  <div className="-ms-5">
                    {replies && (
                      <Replies commentCreator={user} replies={replies} />
                    )}
                    <div className="-ms-6">
                      {!post.isCommentsDisabled && currentUser && (
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
