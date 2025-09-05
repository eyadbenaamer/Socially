import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowMessage } from "state";
import { ReactComponent as CloseIcon } from "assets/icons/cross.svg";
import "./index.css";

const PopupMessage = () => {
  const popupMessage = useSelector((state) => state.popupMessage);
  const theme = useSelector((state) => state.settings.theme);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const resetMessage = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      dispatch(setShowMessage({ message: "", type: "info" }));
    }, 300); // Match CSS transition duration
  };

  useEffect(() => {
    if (popupMessage && popupMessage.message) {
      setIsVisible(true);
      setIsExiting(false);
      const timer = setTimeout(() => {
        resetMessage();
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [popupMessage]);

  if (!isVisible) return null;

  // Determine type class
  const typeClass = popupMessage.type === "error" ? "type-error" : "type-info";

  return (
    <div className="info-message-container">
      <div
        className={`info-message ${typeClass} ${
          isExiting ? "info-message-exit" : "info-message-enter"
        } theme-${theme}`}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="info-message-header">
          <div className="info-message-content">
            <p className="info-message-text">{popupMessage.message}</p>
          </div>
          <button
            className="info-message-close-btn"
            onClick={resetMessage}
            aria-label="Close message"
            type="button"
          >
            <CloseIcon className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;
