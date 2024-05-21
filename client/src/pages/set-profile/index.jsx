import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthStatus, setToken } from "state";

import DropZone from "components/dropzone";
import SubmitBtn from "components/SubmitBtn";

import axiosClient from "utils/AxiosClient";

const SetProfile = () => {
  const [picture, setPicture] = useState(null);
  const [isProfileSet, setIsProfileSet] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      {isProfileSet && <Navigate to={"/"} replace={true} />}
      <h1>You are almost done!</h1>
      <h2>Now set your profile picture so other users can recognize you</h2>
      <DropZone multiple={false} onChange={(file) => setPicture(file)} />
      <SubmitBtn
        disabled={!picture}
        onClick={() => {
          let formData = new FormData();
          formData.append("picture", picture);

          axiosClient.patch(`set_profile`, formData).then((resposnse) => {
            dispatch(setAuthStatus({ isLoggedIn: true }));
            setIsProfileSet(true);
            dispatch(setToken(resposnse.data));
          });
        }}
      >
        Set
      </SubmitBtn>
    </div>
  );
};

export default SetProfile;
