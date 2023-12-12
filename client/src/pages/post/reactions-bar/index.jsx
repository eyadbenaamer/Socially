import { useContext } from "react";
import Comments from "./Comments";
import Share from "./Share";
import { PostContext } from "..";
import Like from "components/post/Like";

const ReactionsBar = () => {
  const { _id: id, creatorId, likes } = useContext(PostContext);
  return (
    <div className="flex py-3 gap-4 justify-around items-center">
      <Like likes={likes} type="post" path={`${creatorId}/${id}`} />
      <Comments />
      <Share />
    </div>
  );
};

export default ReactionsBar;
