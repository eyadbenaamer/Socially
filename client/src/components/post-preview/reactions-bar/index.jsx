import Comments from "./Comments";
import Like from "./Like";
import Share from "./Share";

const ReactionsBar = (props) => {
  const { id, creatorId, commentsCount, likes } = props;
  return (
    <div className="flex py-3 gap-4 justify-around items-center">
      <Like likes={likes} id={id} creatorId={creatorId} />
      <Comments id={id} creatorId={creatorId} commentsCount={commentsCount} />
      <Share />
    </div>
  );
};

export default ReactionsBar;
