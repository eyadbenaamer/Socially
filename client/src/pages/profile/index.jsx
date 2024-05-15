import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Content from "./Content";
import CoverPicture from "./CoverPicture";
import Bar from "components/bar";
import NotFound from "pages/NotFound";

import { useWindowWidth } from "hooks/useWindowWidth";

import axiosClient from "utils/AxiosClient";

const Profile = () => {
  const windowWidth = useWindowWidth();
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const getUser = () => {
      axiosClient(`profile/${id}`).then((response) => {
        if (response.status === 200) {
          setProfile(response.data);
        } else {
          setProfile("not found");
        }
      });
    };
    getUser();
  }, [id]);
  return (
    <>
      {profile === "not found" ? (
        <NotFound />
      ) : (
        <>
          <CoverPicture
            coverPath={profile?.coverPath}
            avatarPath={profile?.avatarPath}
          />
          {profile && <Content profile={profile} />}
        </>
      )}

      {windowWidth <= 768 && user && <Bar />}
    </>
  );
};

export default Profile;
