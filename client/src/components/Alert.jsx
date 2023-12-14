import { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/cross.svg";

const Alert = (props) => {
  const { message, type, isOpened, setIsOpened } = props;
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
