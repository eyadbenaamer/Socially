import { useSelector } from "react-redux";
import OptionsBtn from "./options-btn";
import Status from "./Status";

const OthersMessage = (props) => {
  const { _id: id, text, info } = props.message;
  const theme = useSelector((state) => state.settings.theme);
  const colors = theme === "dark" ? "bg-200 text-white" : "bg-100";
  return (
    <div className="w-full flex justify-start gap-2">
      <div
        className={`${colors} flex rounded-xl px-3 py-2 shadow-md max-w-[80%] sm:max-w-[60%]`}
      >
        {text}
        <div className="self-end">
          <Status info={info} />
        </div>
      </div>
      <OptionsBtn id={id} />
    </div>
  );
};

export default OthersMessage;
