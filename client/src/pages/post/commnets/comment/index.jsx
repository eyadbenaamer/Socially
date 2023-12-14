import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import { useContext, useState } from "react";
import Replies from "./replies";
import OptionsBtn from "./options-btn";
import Media from "./Media";
import { Link, useParams } from "react-router-dom";
import AddComment from "pages/post/AddComment";
import useGetTime from "hooks/useGetTime";
import { PostContext } from "pages/post";
import Like from "components/post/Like";
import { ReactComponent as CommentIcon } from "../../../../assets/icons/comments.svg";
import { useSelector } from "react-redux";
const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
  } = props;
  const post = useContext(PostContext);
  const [user] = useFetchUser(creatorId);
  const currentUser = useSelector((state) => state.user);
  const [isModifying, setIsModifying] = useState(false);
  const { commentId } = useParams();
  const [showReplies, setShowReplies] = useState(false);
  const time = useGetTime(createdAt);
  return (
    <>
      {props.comment && user && (
        <div
          tabIndex={0}
          id={commentId === id ? "targetComment" : ""}
          className="flex flex-col gap-2 outline-1 radius items-start justify-start"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-start">
              <div className="flex">
                <UserPicture
                  id={user._id}
                  src={user.picturePath}
                  name={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex  items-center gap-2">
                      <div
                        className={`bg-300 radius shadow-md w-fit px-3 py-2`}
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
                      <div className="radius overflow-hidden w-fit">
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
                    path={`${post.creatorId}/${post._id}/${id}`}
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
                        <AddComment
                          autoFocus={true}
                          type="reply"
                          commentId={id}
                        />
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
