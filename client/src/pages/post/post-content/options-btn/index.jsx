import { useSelector } from "react-redux";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more.svg";
import { useContext, useRef, useState } from "react";
import useCloseWidget from "hooks/useCloseWidget";
import ToggleComments from "./ToggleComments";
import { PostContext } from "pages/post";
import CopyLink from "components/post/options-btn/CopyLink";
import SavePost from "components/post/options-btn/SavePost";
import Edit from "components/post/options-btn/Edit";
import Delete from "components/post/options-btn/Delete";

const OptionsBtn = (props) => {
  const { setIsModifying } = props;
  const { _id: id, creatorId } = useContext(PostContext);

  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.settings.mode);
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useRef(null);
  useCloseWidget(optionsList, setIsOpen);
  return (
    <div className="relative">
      <button
        aria-label="post options"
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
          className={`absolute top-[100%] right-0 radius w-max overflow-hidden z-20 ${
            mode === "dark" ? "bg-300" : "bg-100"
          }`}
          ref={optionsList}
          // onClick={() => setIsOpen(!isOpen)}
        >
          {user._id === creatorId && (
            <>
              <Delete id={id} user={user} />
              <Edit setIsModifying={setIsModifying} id={id} user={user} />
              <ToggleComments />
            </>
          )}
          <SavePost path={`${creatorId}/${id}`} />
          <CopyLink postPath={`${creatorId}/${id}`} />
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
