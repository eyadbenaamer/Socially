import { useSelector } from "react-redux";
import { ReactComponent as SaveIcon } from "../../../../assets/icons/save.svg";

const SavePost = (props) => {
  const { postPath } = props;
  const user = useSelector((state) => state.user);
  const savePost = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/toggle_save_post/${postPath}`, {
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
          <SaveIcon />
        </span>
        Save the post
      </button>
    </li>
  );
};

export default SavePost;
