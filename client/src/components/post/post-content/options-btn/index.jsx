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

const OptionsBtn = ({ setIsModifying }) => {
  // Destructure post info from context
  const { _id: postId, creatorId } = useContext(PostContext);

  // Get current user info from Redux
  const profile = useSelector((state) => state.profile);

  // Get current theme (light/dark) from Redux
  const theme = useSelector((state) => state.settings.theme);

  // State to toggle options menu visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to the options container (used for outside click detection)
  const optionsList = useRef(null);

  // Closes menu if clicked outside the component
  useCloseWidget(optionsList, setIsOpen);

  // Determine ownership of the post
  const isOwner = profile._id === creatorId;

  // Theme-based styling
  const buttonThemeClasses =
    theme === "dark"
      ? "hover:bg-[#303343] focus:bg-[#303343]"
      : "hover:bg-[#eaedfb] focus:bg-[#eaedfb]";

  const iconFill = theme === "dark" ? "#c3c5cd" : "#5b5d67";
  const menuBg = theme === "dark" ? "bg-300" : "bg-100";

  return (
    <div ref={optionsList} className="relative">
      {/* Button to toggle the dropdown menu */}
      <button
        aria-label="post options"
        className={`aspect-square w-10 flex justify-center items-center icon transition cursor-pointer ${buttonThemeClasses}`}
        style={{ borderRadius: "50%" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MoreIcon style={{ fill: iconFill }} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          className={`absolute top-full right-0 rounded-xl w-max overflow-hidden z-10 ${menuBg}`}
        >
          {/* Options only visible to post owner */}
          {isOwner && (
            <div onClick={() => setIsOpen(false)}>
              <Delete /> {/* Deletes the post */}
              <Edit
                setIsModifying={setIsModifying}
                id={postId}
                user={profile}
              />{" "}
              {/* Edit mode */}
              <ToggleComments /> {/* Toggle comment visibility */}
            </div>
          )}

          {/* Public options */}
          <div onClick={() => setIsOpen(false)}>
            <SavePost path={`${creatorId}/${postId}`} />{" "}
            {/* Save post feature */}
            <CopyLink postPath={`${creatorId}/${postId}`} />{" "}
            {/* Copy post link */}
          </div>
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
