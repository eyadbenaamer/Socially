import { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/cross.svg";

const Alert = (props) => {
  const { type, isOpened, setIsOpened } = props;
  const [message, setMessage] = useState(props.message);
  useEffect(() => setIsOpened(true), [message]);
  return (
    <>
      {isOpened && (
        <div className={`flex flex-col p-2 radius alert ${type}`}>
          <button
            className="w-3 -translate-x-1"
            onClick={() => setIsOpened(false)}
          >
            <CloseIcon />
          </button>
          {message}
        </div>
      )}
    </>
  );
};

export default Alert;
