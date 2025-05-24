import { useDispatch } from "react-redux";

import { setShowMessage } from "state";

import { ReactComponent as CopyIcon } from "assets/icons/copy.svg";

const CopyLink = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  return (
    <>
      <li>
        <button
          className="flex w-full gap-2 p-3 bg-hovered"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.host}/post?_id=${id}`
            );
            dispatch(setShowMessage("Link copied."));
          }}
        >
          <span className="w-6">
            <CopyIcon />
          </span>
          Copy the post link
        </button>
      </li>
    </>
  );
};

export default CopyLink;
