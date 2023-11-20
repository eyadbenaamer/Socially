import { useSelector } from "react-redux";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more.svg";
import { useRef, useState } from "react";
import useCloseWidget from "hooks/useCloseWidget";
import Delete from "./Delete";
import state from "state";

const OptionsBtn = (props) => {
  const { id, user } = props;
  const currentUser = useSelector((state) => state.user);
  const mode = useSelector((state) => state.settings.mode);
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useRef(null);
  useCloseWidget(optionsList, setIsOpen);
  return (
    <>
      <div
        className="aspect-square w-10 flex justify-center items-center icon transition cursor-pointer "
        style={{ borderRadius: "50%" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreIcon style={{ fill: mode === "dark" ? "#c3c5cd" : "#5b5d67 " }} />
      </div>
      {isOpen && (
        <ul ref={optionsList}>
          {currentUser._id === user._id && <Delete id={id} user={user} />}
        </ul>
      )}
    </>
  );
};

export default OptionsBtn;
