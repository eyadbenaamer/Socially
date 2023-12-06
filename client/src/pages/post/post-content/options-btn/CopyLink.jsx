import { useSelector } from "react-redux";
import { ReactComponent as TrashIcon } from "../../../../assets/icons/copy.svg";

const CopyLink = (props) => {
  const { postPath } = props;
  const user = useSelector((state) => state.user);
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.host}/post/${postPath}`);
  };
  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => copyLink()}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Copy the post link.
      </button>
    </li>
  );
};

export default CopyLink;
