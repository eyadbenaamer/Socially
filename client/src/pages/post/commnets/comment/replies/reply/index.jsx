import Text from "components/Text";
import UserPicture from "components/UserPicture";
import useFetchUser from "hooks/useFetchUser";
import Media from "../../Media";
import OptionsBtn from "./options-btn";
import { useContext, useState } from "react";
import { PostContext } from "pages/post";

const Reply = (props) => {
  const {
    reply: { _id: id, createdAt, creatorId, text, likes, file, rootCommentId },
  } = props;
  const { _id: postId } = useContext(PostContext);
  const [user] = useFetchUser(creatorId);
  const [isModifying, setIsModifying] = useState(false);

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
                <div className="bg-300 radius w-fit shadow-sm scale-75">
                  {
                    <Text
                      type="reply"
                      text={text}
                      postId={postId}
                      commentId={rootCommentId}
                      replyId={id}
                      isModifying={isModifying}
                      setIsModifying={setIsModifying}
                    />
                  }
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
