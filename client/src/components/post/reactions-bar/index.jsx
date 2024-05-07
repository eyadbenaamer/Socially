import { useContext } from "react";
import Comments from "./Comments";
import { PostContext } from "..";
import Like from "./Like";
import Share from "./share";

const ReactionsBar = () => {
  const { _id: id, creatorId, likes } = useContext(PostContext);
  return (
    <div className="flex gap-4 justify-around items-center">
      <Like likes={likes} type="post" userId={creatorId} postId={id} />
      <Comments />
      <Share />
    </div>
  );
};

export default ReactionsBar;
