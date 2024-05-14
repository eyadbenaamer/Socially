import { useContext } from "react";
import Comments from "./Comments";
import { PostContext } from "..";
import Like from "./Like";
import Share from "./share";
import Views from "./Views";

const ReactionsBar = () => {
  const { _id: id, creatorId, likes } = useContext(PostContext);
  return (
    <div className="flex flex-col gap-2">
      <div className="self-end">
        <Views />
      </div>
      <div className="flex gap-4 justify-around items-center">
        <Like likes={likes} type="post" userId={creatorId} postId={id} />
        <Comments />
        <Share />
      </div>
    </div>
  );
};

export default ReactionsBar;
