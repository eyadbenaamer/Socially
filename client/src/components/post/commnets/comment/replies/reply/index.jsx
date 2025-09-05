import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import Like from "./Like";
import Text from "components/Text";
import UserPicture from "components/UserPicture";
import Media from "../../Media";
import OptionsBtn from "./options-btn";

import useGetTime from "hooks/useGetTime";

import { PostContext } from "components/post";

const Reply = (props) => {
  const {
    reply: {
      _id: id,
      createdAt,
      creatorId,
      profile,
      text,
      isLiked,
      likesCount,
      file,
      commentId,
    },
  } = props;
  const post = useContext(PostContext);

  const [isModifying, setIsModifying] = useState(false);

  const time = useGetTime(createdAt);

  if (!(props.reply && profile)) return null;

  return (
    <div className="flex items-start">
      <div className="flex scale-75">
        <span className="w-12">
          <UserPicture profile={profile} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="bg-300 rounded-xl shadow-md px-3 py-2 w-fit">
            <Link
              to={`/profile/${profile.username}`}
              className="hover:underline"
            >
              {profile.firstName} {profile.lastName}
            </Link>
            <Text
              postCreatorId={post.creatorId}
              type="reply"
              text={text}
              postId={post._id}
              commentId={commentId}
              replyId={id}
              isModifying={isModifying}
              setIsModifying={setIsModifying}
            />
          </div>
          <OptionsBtn
            replyCreatorId={creatorId}
            commentId={commentId}
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
            isLiked={isLiked}
            likesCount={likesCount}
            userId={post.creatorId}
            postId={post._id}
            commentId={commentId}
            replyId={id}
          />
          <span className="block text-xs text-slate-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Reply;
