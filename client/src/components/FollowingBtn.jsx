import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProfileContext } from "pages/profile";

import { setProfile as setMyProfile } from "state";

import axiosClient from "utils/AxiosClient";

const FollowToggleBtn = (props) => {
  const { id: accountToFollowId } = props;
  const myProfile = useSelector((state) => state.profile);
  const following = myProfile?.following;
  const myProfileId = myProfile?._id;
  const { _id: profileId, setProfile } = useContext(ProfileContext);
  const isFollowing = following?.find((acc) => acc._id === accountToFollowId);
  const dispatch = useDispatch();

  const followToggle = () => {
    axiosClient
      .patch(
        `/profile/${
          isFollowing ? "unfollow" : "follow"
        }?userId=${accountToFollowId}`
      )
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
      {/* only show "follow toggle" button for loggedin user */}
      {myProfile && accountToFollowId !== myProfileId && (
        <button
          className={`py-1 px-3 h-fit rounded-xl text-white ${
            isFollowing ? "bg-red-500" : "bg-primary"
          }`}
          onClick={followToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </>
  );
};

export default FollowToggleBtn;
