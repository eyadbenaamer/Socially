import { useContext } from "react";
import { useState } from "react";

import CreatorInfo from "./CreatorInfo";
import OptionsBtn from "./options-btn";
import Text from "components/Text";
import Slider from "components/slider";

import { PostContext } from "..";
import Views from "../reactions-bar/Views";

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
      <div className="flex justify-between px-2 sm:px-4">
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
      <div className="flex flex-col w-full px-1 sm:px-4">
        <div className="py-3 px-1">
          <Text
            postCreatorId={creatorId}
            text={text}
            type="post"
            postId={id}
            isModifying={isModifying}
            setIsModifying={setIsModifying}
          />
        </div>
        <div className="self-end px-4 py-2">
          <Views />
        </div>
        {files?.length > 0 && <Slider files={files} />}
      </div>
    </>
  );
};

export default PostContent;
