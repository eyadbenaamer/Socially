import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import Delete from "./Delete";
import SetRead from "./SetRead";

import useCloseWidget from "hooks/useCloseWidget";

import { ReactComponent as MoreIcon } from "assets/icons/more.svg";

const OptionsBtn = (props) => {
  const { id, isRead } = props;
  const theme = useSelector((state) => state.settings.theme);
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useRef(null);

  useCloseWidget(optionsList, setIsOpen);

  return (
    <div
      ref={optionsList}
      className="relative flex items-center h-fit self-center"
    >
      <button
        aria-label="notification options"
        className={`aspect-square w-8 flex justify-center items-center icon transition cursor-pointer `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreIcon style={{ fill: theme === "dark" ? "#c3c5cd" : "#5b5d67 " }} />
      </button>
      {isOpen && (
        <ul
          className={`menu absolute top-[100%] right-0 rounded-xl w-max overflow-hidden z-20 ${
            theme === "dark" ? "bg-300" : "bg-100"
          }`}
        >
          <Delete id={id} />
          {!isRead && <SetRead id={id} />}
        </ul>
      )}
    </div>
  );
};

export default OptionsBtn;
