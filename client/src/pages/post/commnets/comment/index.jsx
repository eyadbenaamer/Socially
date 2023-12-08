import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import { useState } from "react";
import Replies from "./replies";
import OptionsBtn from "./options-btn";
import Media from "./Media";
import { useParams } from "react-router-dom";
import AddComment from "pages/post/AddComment";

const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
    postId,
  } = props;
  const [user] = useFetchUser(creatorId);
  const [isModifying, setIsModifying] = useState(false);
  const { commentId } = useParams();
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
                  <div className={`bg-300 radius shadow-sm w-fit`}>
                    <Text
                      text={text}
                      type="comment"
                      postId={postId}
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
          {replies && <Replies replies={replies} />}
          <div className="scale-7500 ">
            <AddComment type="reply" commentId={id} />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
