import { useDispatch } from "react-redux";
import { setShowMessage } from "state";
import axiosClient from "utils/AxiosClient";

const RemoveFollowerBtn = (props) => {
  const { id, setFollowers, setCount } = props;

  const dispatch = useDispatch();

  const followToggle = () => {
    axiosClient
      .patch(`/profile/remove_follower?userId=${id}`)
      .catch((err) => {
        if (err.response) {
          dispatch(
            setShowMessage({
              message: err.response.data?.message,
              type: "error",
            })
          );
        }
      })
      .finally(() => {
        setCount((prev) => prev - 1);
        setFollowers((prev) => prev.filter((profile) => profile._id !== id));
      });
  };

  return (
    <button
      className="py-1 px-3 rounded-xl bg-alt shadow-md text-sm"
      onClick={followToggle}
    >
      Remove
    </button>
  );
};

export default RemoveFollowerBtn;
