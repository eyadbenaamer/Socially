import { useDispatch, useSelector } from "react-redux";
import { setShowMessage } from "state";

import { ReactComponent as CLoseIcon } from "assets/icons/cross.svg";

const InfoMessage = () => {
  const infoMessage = useSelector((state) => state.infoMessage);
  const dispatch = useDispatch();
  const resetMessage = () => dispatch(setShowMessage(""));

  setTimeout(resetMessage, 10000);

  return (
    <>
      {infoMessage && (
        <div className="popup fixed bg-200 shadow-lg p-2 bottom-5 right-6 z-40 rounded-xl">
          <span onClick={resetMessage} className="cursor-pointer block w-3">
            <CLoseIcon />
          </span>
          <div className="p-2">{infoMessage}</div>
        </div>
      )}
    </>
  );
};

export default InfoMessage;
