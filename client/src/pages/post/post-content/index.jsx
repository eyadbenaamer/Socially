import Media from "./Media";
import { useState } from "react";
import { CreatorInfo } from "./CreatorInfo";
import OptionsBtn from "./options-btn";
import { useContext } from "react";
import { PostContext } from "..";
import Text from "components/Text";
const PostContent = (props) => {
  const {
    _id: id,
    creatorId,
    createdAt,
    location,
    media,
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
      <div className="px-4 flex flex-col">
        <Text
          text={text}
          type="post"
          postId={id}
          isModifying={isModifying}
          setIsModifying={setIsModifying}
        />

        {media && <Media media={media} />}
      </div>
    </>
  );
};

export default PostContent;
