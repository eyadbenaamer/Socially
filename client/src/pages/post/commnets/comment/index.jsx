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

const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
  } = props;
  const post = useContext(PostContext);
  const [user] = useFetchUser(creatorId);
  const [isModifying, setIsModifying] = useState(false);
  const { commentId } = useParams();
  const time = useGetTime(createdAt);
  return (
    <>
      {props.comment && (
        <div
          tabIndex={0}
          id={commentId === id ? "targetComment" : ""}
          className="flex flex-col gap-2 outline-1 radius items-start justify-start"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-start">
              <div className="flex scale-90">
                <UserPicture
                  id={user._id}
                  src={user.picturePath}
                  name={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-2">
                  <div className={`bg-300 radius shadow-sm w-fit px-3 py-2`}>
                    <Link
                      to={`/profile/${user._id}`}
                      className="hover:underline"
                    >
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
                      text={text}
                      type="comment"
                      postId={post._id}
                      commentId={id}
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
                <OptionsBtn
                  commentId={id}
                  commentCreatorId={creatorId}
                  setIsModifying={setIsModifying}
                  id={id}
                />
              </div>
            </div>
          </div>
          {replies && <Replies commentCreator={user} replies={replies} />}
          <div className="scale-7500 ">
            <AddComment type="reply" commentId={id} />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
