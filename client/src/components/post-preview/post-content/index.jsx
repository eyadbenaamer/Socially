import MediaPreview from "./MediaPreview";
import Text from "../../Text";
import { useState } from "react";
import { CreatorInfo } from "./CreatorInfo";
import OptionsBtn from "./options-btn";
const PostContent = (props) => {
  const { id, user, createdAt, location, media, text } = props;
  const [isModifying, setIsModifying] = useState(false);

  return (
    <>
      <div className="flex justify-between px-2">
        <CreatorInfo
          user={user}
          createdAt={createdAt}
          location={location}
          postId={id}
        />
        <div>
          <OptionsBtn id={id} user={user} setIsModifying={setIsModifying} />
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

        {media && <MediaPreview media={media} />}
      </div>
    </>
  );
};

export default PostContent;
