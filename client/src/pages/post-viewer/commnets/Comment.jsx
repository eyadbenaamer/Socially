import Text from "components/Text";
import UserPicture from "components/UserPicture";
import { CreatorInfo } from "components/post/upper-part/CreatorInfo";
import OptionsBtn from "components/post/upper-part/options-btn";
import useFetchUser from "hooks/useFetchUser";
import { useRef, useState } from "react";
import Comments from ".";
import Replies from "./replies";

const Comment = (props) => {
  const {
    comment: { _id, createdAt, creatorId, content, likes, replies },
  } = props;
  const [user, setUser] = useFetchUser(creatorId);
  const textArea = useRef();
  const [modifiedText, setModifiedText] = useState("");
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
              <div className="bg-300 radius p-3 shadow-sm">
                {
                  <Text
                    textArea={textArea}
                    isModifying={isModifying}
                    setModifiedText={setModifiedText}
                    text={content}
                  />
                }
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
