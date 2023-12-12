import { useSelector } from "react-redux";
import { ReactComponent as MoreIcon } from "../../../../../../../assets/icons/more.svg";
import { useContext, useRef, useState } from "react";
import useCloseWidget from "hooks/useCloseWidget";
import Delete from "./Delete";
import Edit from "./Edit";
import { PostContext } from "pages/post";
import CopyLink from "./CopyLink";

const OptionsBtn = (props) => {
  const { commentId, replyId, replyCreatorId, setIsModifying } = props;
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.settings.mode);
  const [isOpen, setIsOpen] = useState(false);
  const post = useContext(PostContext);
  const optionsList = useRef(null);

  useCloseWidget(optionsList, setIsOpen);

  return (
    <div className="relative">
      <button
        aria-label="comment options"
        className={`aspect-square w-10 flex justify-center ${
          mode === "dark"
            ? "hover:bg-[#303343] focus:bg-[#303343]"
            : "hover:bg-[#eaedfb] focus:bg-[#eaedfb]"
        } items-center icon transition cursor-pointer `}
        style={{ borderRadius: "50%" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreIcon style={{ fill: mode === "dark" ? "#c3c5cd" : "#5b5d67 " }} />
      </button>
      {isOpen && (
        <ul
          className={`menu absolute top-[100%] right-0 radius w-max overflow-hidden z-20 ${
            mode === "dark" ? "bg-300" : "bg-100"
          }`}
          ref={optionsList}
          // onClick={() => setIsOpen(!isOpen)}
        >
          {user && user._id === replyCreatorId && (
            <Delete
              replyPath={`${post.creatorId}/${post._id}/${commentId}/${replyId}`}
            />
          )}
          {user && user._id === replyCreatorId && (
            <Edit setIsModifying={setIsModifying} />
          )}
          <CopyLink
            commentPath={`${post.creatorId}/${post._id}/${commentId}/${replyId}`}
          />
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
