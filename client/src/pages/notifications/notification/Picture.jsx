import { ReactComponent as LikeIcon } from "assets/icons/like.svg";
import { ReactComponent as CommentIcon } from "assets/icons/comments.svg";
import { ReactComponent as ShareIcon } from "assets/icons/share.svg";

const Picture = (props) => {
  const { picture, notificationType } = props;

  return (
    <div className="relative">
      <div className="circle w-12 shadow-md border-2">
        <img className="h-full w-full" loading="lazy" src={picture} />
      </div>
      {notificationType === "like" && (
        <div className="absolute -right-[7px] bottom-0.5 scale-[3.5] h-5 w-5">
          <LikeIcon color="#e53935" />
        </div>
      )}
      {notificationType === "comment" && (
        <div className="absolute -right-[5px] bottom-1 h-5 w-5">
          <div className="text-primary">
            <CommentIcon className="w-6" fill="white" />
          </div>
        </div>
      )}
      {notificationType === "share" && (
        <div className="absolute -right-[5px] bottom-1 h-5 w-5">
          <div className="text-primary">
            <ShareIcon className="w-6" fill="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Picture;
