import { useWindowWidth } from "hooks/useWindowWidth";
import Comments from "./Comments";
import Like from "./Like";
import Share from "./Share";

const ReactionBar = (props) => {
  const { id, creatorId, commentsCount, likes } = props;
  const windowWidth = useWindowWidth();
  return (
    <div className="flex gap-4 justify-around items-center">
      <Like likes={likes} id={id} creatorId={creatorId} />
      <Comments id={id} creatorId={creatorId} commentsCount={commentsCount} />
      <Share />
    </div>
  );
};

export default ReactionBar;
