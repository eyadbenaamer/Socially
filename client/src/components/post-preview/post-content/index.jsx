import Text from "../../Text";
import { useContext, useState } from "react";
import { CreatorInfo } from "./CreatorInfo";
import OptionsBtn from "./options-btn";
import { PostContext } from "..";
import Media from "components/post/Media";
const PostContent = () => {
  const {
    _id: id,
    user,
    createdAt,
    location,
    creatorId,
    files,
    text,
  } = useContext(PostContext);
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
      <div className="px-1 sm:px-4 flex flex-col">
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
