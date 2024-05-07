import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import Media from "../../Media";
import OptionsBtn from "./options-btn";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import useGetTime from "hooks/useGetTime";
import Like from "components/post/reactions-bar/Like";
import { PostContext } from "components/post";

const Reply = (props) => {
  const {
    reply: { _id: id, createdAt, creatorId, text, likes, file, rootCommentId },
  } = props;
  const post = useContext(PostContext);
  const [user] = useFetchUser(creatorId);
  const [isModifying, setIsModifying] = useState(false);
  const time = useGetTime(createdAt);
  return (
    <>
      {props.reply && user && (
        <div className="flex items-start">
          <div className="flex scale-75">
            <UserPicture
              id={user._id}
              src={user.avatarPath}
              name={`${user.firstName} ${user.lastName}`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="bg-300 rounded-xl shadow-md px-3 py-2 w-fit">
                <Link to={`/profile/${user._id}`} className="hover:underline">
                  {user.firstName} {user.lastName}
                </Link>
                <Text
                  postCreatorId={post.creatorId}
                  type="reply"
                  text={text}
                  postId={post._id}
                  commentId={rootCommentId}
                  replyId={id}
                  isModifying={isModifying}
                  setIsModifying={setIsModifying}
                />
              </div>
              <OptionsBtn
                replyCreatorId={creatorId}
                commentId={rootCommentId}
                replyId={id}
                setIsModifying={setIsModifying}
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
            <div className="flex gap-3 items-center justify-start">
              <Like
                likes={likes}
                type="reply"
                userId={creatorId}
                postId={post._id}
                commentId={rootCommentId}
                replyId={id}
              />
              <span className="block text-xs text-slate-400">{time}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reply;
