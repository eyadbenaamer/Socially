import OptionsBtn from "./options-btn";

import { ReactComponent as SingleTickIcon } from "assets/icons/single-tick.svg";
import { ReactComponent as DoubleTickIcon } from "assets/icons/double-tick.svg";

const MyMessage = (props) => {
  const { _id: id, text, info } = props.message;
  return (
    <div className="w-full flex justify-end gap-2">
      <OptionsBtn id={id} />
      <div className="bg-[#5b6ecd] flex text-white rounded-xl px-2 py-1 shadow-md max-w-[80%] sm:max-w-[60%]">
        <div className="self-end">
          <div className="w-7">
            {info.deliveredTo.length === 1 && <SingleTickIcon />}
            {info.deliveredTo.length === 2 && (
              <DoubleTickIcon
                strokeWidth={0}
                className={
                  info.readBy.length === 2 ? "text-[#434eee]" : "text-[white]"
                }
              />
            )}
          </div>
        </div>
        {text}
      </div>
    </div>
  );
};

export default MyMessage;
