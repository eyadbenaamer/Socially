import { ReactComponent as CloseIcon } from "assets/icons/cross.svg";
import "./index.css";

const Alert = (props) => {
  const { message, type, isOpened, setIsOpened } = props;

  return (
    <>
      {isOpened && (
        <div className={`flex flex-col p-2 rounded-xl alert ${type}`}>
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
