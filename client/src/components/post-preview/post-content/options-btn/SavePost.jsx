import { ReactComponent as TrashIcon } from "../../../../assets/icons/trash-basket.svg";

const SavePost = (props) => {
  const { id, user } = props;
  const savePost = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/toggle_save_post/${user._id}/${id}`, {
      method: "POST",
      headers: { authorization: user.token },
    });
  };
  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => savePost()}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Save the post
      </button>
    </li>
  );
};

export default SavePost;
