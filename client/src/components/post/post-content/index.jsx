import MediaPreview from "./MediaPreview";
import Text from "../../Text";
import { useRef, useState } from "react";
import SubmitBtn from "components/SubmitBtn";
import PrimaryBtn from "components/PrimaryBtn";
import UpperPart from "../upper-part";

const PostContent = (props) => {
  const { id, user, createdAt, location, media, text } = props;

  const textArea = useRef();
  const [modifiedText, setModifiedText] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  return (
    <>
      <UpperPart
        id={id}
        user={user}
        createdAt={createdAt}
        location={location}
      />
      <div className="px-4 flex flex-col">
        <Text
          isModifying={isModifying}
          setModifiedText={setModifiedText}
          text={text}
        />
        {isModifying && (
          <div className="self-end flex gap-3">
            <span>
              <PrimaryBtn onClick={() => setIsModifying(false)}>
                Cancel
              </PrimaryBtn>
            </span>
            <span>
              <SubmitBtn
                disabled={!modifiedText || modifiedText === props.text}
              >
                Edit
              </SubmitBtn>
            </span>
          </div>
        )}
        {media && <MediaPreview media={media} />}
      </div>
    </>
  );
};

export default PostContent;
