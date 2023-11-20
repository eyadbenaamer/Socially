import axios from "axios";
import DropZone from "components/dropzone";
import SubmitBtn from "components/SubmitBtn";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SetProfile = () => {
  const { token } = useSelector((state) => state.user);
  const [picture, setPicture] = useState(null);
  const [isProfileSet, setIsProfileSet] = useState(false);
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
          fetch(`${process.env.REACT_APP_API_URL}/set_profile`, {
            body: formData,
            method: "PATCH",
            headers: { Authorization: token },
          }).then(
            (resolved) => setIsProfileSet(true),
            () => {}
          );
        }}
      >
        Set
      </SubmitBtn>
    </div>
  );
};

export default SetProfile;
