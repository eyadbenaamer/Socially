import { useContext } from "react";
import Comments from "./Comments";
import Like from "./Like";
import Share from "./Share";
import { PostContext } from "..";

const ReactionsBar = () => {
  const { _id: id, creatorId, likes } = useContext(PostContext);
  return (
    <div className="flex py-3 gap-4 justify-around items-center">
      <Like likes={likes} id={id} creatorId={creatorId} />
      <Comments />
      <Share />
    </div>
  );
};

export default ReactionsBar;
