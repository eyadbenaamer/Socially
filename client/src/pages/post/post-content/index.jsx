import Media from "components/post/Media";
import { useState } from "react";
import { CreatorInfo } from "./CreatorInfo";
import OptionsBtn from "./options-btn";
import { useContext } from "react";
import { PostContext } from "..";
import Text from "components/Text";
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
      <div className="flex justify-between px-2">
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
      <div className="md:px-4 flex flex-col gap-3">
        <Text
          postCreatorId={creatorId}
          text={text}
          type="post"
          postId={id}
          isModifying={isModifying}
          setIsModifying={setIsModifying}
        />

        {files && <Media media={files} />}
      </div>
    </>
  );
};

export default PostContent;
