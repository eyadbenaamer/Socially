import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setProfile as setMyProfile } from "state";
import { ProfileContext } from "..";

import axiosClient from "utils/AxiosClient";

const RemoveFollowerBtn = (props) => {
  const { id } = props;
  const { _id: profileId, setProfile } = useContext(ProfileContext);
  const { _id: myProfileId } = useSelector((state) => state.profile);
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
          className="py-1 px-3 h-fit rounded-xl text-white bg-red-500"
          onClick={followToggle}
        >
          Remove follower
        </button>
      )}
    </>
  );
};

export default RemoveFollowerBtn;
