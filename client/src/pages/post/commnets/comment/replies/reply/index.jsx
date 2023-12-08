import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import Media from "../../Media";
import OptionsBtn from "./options-btn";
import { useContext, useState } from "react";
import { PostContext } from "pages/post";
import { Link } from "react-router-dom";
import useGetTime from "hooks/useGetTime";

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
      {props.reply && (
        <div className="flex flex-col ">
          <div className="flex items-center">
            <div className="flex  items-start  ">
              <div className="flex scale-75">
                <UserPicture
                  id={user._id}
                  src={user.picturePath}
                  name={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="flex flex-col ">
                <div className="bg-300 radius shadow-sm w-fit px-3 py-2 scale-90">
                  <Link to={`/profile/${user._id}`} className="hover:underline">
                    {user.firstName} {user.lastName}
                  </Link>
                  <span
                    className="block text-slate-400"
                    style={{ fontSize: "10px", lineHeight: "0.5" }}
                  >
                    {time}
                  </span>
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
            <OptionsBtn
              replyCreatorId={creatorId}
              commentId={rootCommentId}
              replyId={id}
              setIsModifying={setIsModifying}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Reply;
