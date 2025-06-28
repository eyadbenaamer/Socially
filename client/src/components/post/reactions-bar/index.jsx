import { useContext } from "react";

import { PostContext } from "..";
import Comments from "./Comments";
import Like from "./Like";
import Share from "./share";

const ReactionsBar = () => {
  const { _id: id, creatorId, likes } = useContext(PostContext);
  return (
    <div className="flex flex-col pt-3">
      <div className="flex gap-4 justify-around items-center">
        <Like likes={likes} type="post" userId={creatorId} postId={id} />
        <Comments />
        <Share />
      </div>
    </div>
  );
};

export default ReactionsBar;
