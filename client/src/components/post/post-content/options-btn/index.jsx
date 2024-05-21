import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";

import useCloseWidget from "hooks/useCloseWidget";

import ToggleComments from "./ToggleComments";
import CopyLink from "./CopyLink";
import SavePost from "./SavePost";
import Edit from "./Edit";
import Delete from "./Delete";

import { PostContext } from "components/post";

import { ReactComponent as MoreIcon } from "assets/icons/more.svg";

const OptionsBtn = (props) => {
  const { setIsModifying } = props;
  const { _id: id, creatorId } = useContext(PostContext);
  const profile = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.settings.theme);
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useRef(null);

  useCloseWidget(optionsList, setIsOpen);

  return (
    <div ref={optionsList} className="relative">
      <button
        aria-label="post options"
        className={`aspect-square w-10 flex justify-center ${
          theme === "dark"
            ? "hover:bg-[#303343] focus:bg-[#303343]"
            : "hover:bg-[#eaedfb] focus:bg-[#eaedfb]"
        } items-center icon transition cursor-pointer `}
        style={{ borderRadius: "50%" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreIcon style={{ fill: theme === "dark" ? "#c3c5cd" : "#5b5d67 " }} />
      </button>
      {isOpen && (
        <ul
          className={`absolute top-[100%] right-0 rounded-xl w-max overflow-hidden z-50 ${
            theme === "dark" ? "bg-300" : "bg-100"
          }`}
        >
          {profile._id === creatorId && (
            <>
              <Delete />
              <div onClick={() => setIsOpen(!isOpen)}>
                <Edit setIsModifying={setIsModifying} id={id} user={profile} />
                <ToggleComments />
              </div>
            </>
          )}
          <div onClick={() => setIsOpen(!isOpen)}>
            <SavePost path={`${creatorId}/${id}`} />
            <CopyLink postPath={`${creatorId}/${id}`} />
          </div>
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
