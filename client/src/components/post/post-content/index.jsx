import { useState } from "react";
import { CreatorInfo } from "./CreatorInfo";
import OptionsBtn from "./options-btn";
import { useContext } from "react";
import { PostContext } from "..";
import Text from "components/Text";
import Slider from "components/slider";
const PostContent = () => {
  const {
    _id: id,
    creatorId,
    createdAt,
    location,

    files,
    text,
  } = useContext(PostContext);
  const [isModifying, setIsModifying] = useState(false);

  return (
    <>
      <div className="flex justify-between px-4">
        <CreatorInfo
          creatorId={creatorId}
          createdAt={createdAt}
          location={location}
          postId={id}
        />
        <div>
          <OptionsBtn setIsModifying={setIsModifying} />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-1 sm:px-4">
        <div className="p-1">
          <Text
            postCreatorId={creatorId}
            text={text}
            type="post"
            postId={id}
            isModifying={isModifying}
            setIsModifying={setIsModifying}
          />
        </div>

        {files?.length > 0 && <Slider files={files} />}
      </div>
    </>
  );
};

export default PostContent;
