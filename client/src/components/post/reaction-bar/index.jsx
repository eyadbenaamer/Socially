import { useWindowWidth } from "hooks/useWindowWidth";
import Comment from "./Comment";
import Like from "./Like";
import Share from "./Share";

const ReactionBar = (props) => {
  const { id, creatorId, commentsCount, likes } = props;
  const windowWidth = useWindowWidth();
  return (
    <div className="flex justify-evenly items-center">
      <Like likes={likes} id={id} creatorId={creatorId} />
      {windowWidth > 400 && (
        <span width={1} className={`bg-inverse h-7 w-[1px] opacity-20`}></span>
      )}
      <Comment />
      {windowWidth > 400 && (
        <span width={1} className={`bg-inverse h-7 w-[1px] opacity-20`}></span>
      )}
      <Share />
    </div>
  );
};

export default ReactionBar;
