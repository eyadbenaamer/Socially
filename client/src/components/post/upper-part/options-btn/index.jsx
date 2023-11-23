import { useSelector } from "react-redux";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more.svg";
import { useRef, useState } from "react";
import useCloseWidget from "hooks/useCloseWidget";
import Delete from "./Delete";
import Edit from "./Edit";

const OptionsBtn = (props) => {
  const { id, user, setIsModifying } = props;
  const currentUser = useSelector((state) => state.user);
  const mode = useSelector((state) => state.settings.mode);
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useRef(null);
  useCloseWidget(optionsList, setIsOpen);
  return (
    <div className="relative">
      <button
        className={` aspect-square w-10 flex justify-center ${
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
          className={`absolute top-[100%] right-0 radius w-max overflow-hidden ${
            mode === "dark" ? "bg-300" : "bg-100"
          }`}
          ref={optionsList}
        >
          {currentUser._id === user._id && <Delete id={id} user={user} />}
          {currentUser._id === user._id && (
            <Edit setIsModifying={setIsModifying} id={id} user={user} />
          )}
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
