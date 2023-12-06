import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import { useState } from "react";
import Replies from "./replies";
import OptionsBtn from "./options-btn";
import MediaViewer from "./MediaViewer";

const Comment = (props) => {
  const {
    comment: { _id: id, createdAt, creatorId, likes, replies, file, text },
    postId,
  } = props;
  const [user] = useFetchUser(creatorId);
  const [isModifying, setIsModifying] = useState(false);

  return (
    <>
      {props.comment && (
        <div className="flex flex-col gap-2">
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
                  {text && (
                    <div className="bg-300 radius p-3 shadow-sm w-fit">
                      <Text
                        text={text}
                        type="comment"
                        postId={postId}
                        commentId={id}
                        isModifying={isModifying}
                        setIsModifying={setIsModifying}
                      />
                    </div>
                  )}
                  <MediaViewer>
                    <div className="radius overflow-hidden w-fit">
                      {file && file.fileType === "photo" && (
                        <img src={file.path} alt="" />
                      )}
                      {file && file.fileType === "video" && (
                        <video controls src={file.path} />
                      )}
                    </div>
                  </MediaViewer>
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
        </div>
      )}
    </>
  );
};

export default Comment;
