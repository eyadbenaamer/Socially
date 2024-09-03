import { ReactComponent as SingleTickIcon } from "assets/icons/single-tick.svg";
import { ReactComponent as DoubleTickIcon } from "assets/icons/double-tick.svg";

const Status = (props) => {
  const { deliveredTo, readBy } = props.info;
  return (
    <div className="w-6">
      {deliveredTo.length === 1 && <SingleTickIcon />}
      {deliveredTo.length === 2 && (
        <DoubleTickIcon
          strokeWidth={0}
          className={readBy.length === 2 ? "text-primary" : "text-[#464851]"}
        />
      )}
    </div>
  );
};

export default Status;
