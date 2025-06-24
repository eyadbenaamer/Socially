import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setProfile as setMyProfile } from "state";
import { ProfileContext } from "..";

import axiosClient from "utils/AxiosClient";

const RemoveFollowerBtn = (props) => {
  const { id } = props;
  const { _id: profileId, setProfile } = useContext(ProfileContext);
  const myProfileId = useSelector((state) => state.profile)?._id;
  const dispatch = useDispatch();
  const followToggle = () => {
    axiosClient
      .patch(`/profile/remove_follower?userId=${id}`)
      .then((response) => {
        // update following list only if this is the loggedin user's profile
        if (myProfileId === profileId) {
          setProfile(response.data);
        }
        dispatch(setMyProfile(response.data));
      });
  };
  return (
    <>
      {/* only show "remove follower" button for loggedin user */}
      {profileId === myProfileId && (
        <button
          className="py-1 px-3 rounded-xl bg-alt shadow-md"
          onClick={followToggle}
        >
          Remove
        </button>
      )}
    </>
  );
};

export default RemoveFollowerBtn;
