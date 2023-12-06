import { ReactComponent as TrashIcon } from "../../../../assets/icons/trash-basket.svg";

const Edit = (props) => {
  const { id, user, setIsModifying } = props;

  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => {
          setIsModifying(true);
        }}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Edit the post
      </button>
    </li>
  );
};

export default Edit;
