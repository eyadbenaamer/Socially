import { useWindowWidth } from "hooks/useWindowWidth";
import { ReactComponent as ShareIcon } from "../../../assets/icons/share.svg";
const Share = (props) => {
  const windowWidth = useWindowWidth();

  return (
    <div className="flex w-auto justify-center gap-1 items-center text-hovered transition cursor-pointer">
      <div className="w-6">
        <ShareIcon />
      </div>
      {windowWidth > 400 && <span>Share</span>}
    </div>
  );
};
export default Share;
