import { useDispatch } from "react-redux";

import axiosClient from "utils/AxiosClient";
import { removeNotification } from "state";

import { ReactComponent as TrashIcon } from "assets/icons/trash-basket.svg";

const Delete = (props) => {
  const { id } = props;

  const dispatch = useDispatch();

  const deleteMessage = async () => {
    await axiosClient
      .delete(`notifications/delete/${id}`)
      .then(() => dispatch(removeNotification(id)));
  };

  return (
    <li>
      <button
        className="flex gap-2 p-3 bg-hovered w-full"
        onClick={deleteMessage}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Delete
      </button>
    </li>
  );
};

export default Delete;
