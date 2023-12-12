import { ReactComponent as TrashIcon } from "../../../assets/icons/copy.svg";

const CopyLink = (props) => {
  const { postPath } = props;

  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.host}/post/${postPath}`
          )
        }
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Copy the post link
      </button>
    </li>
  );
};

export default CopyLink;
