import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Content from "./Content";
import CoverPicture from "./CoverPicture";
import FollowingStatus from "./FollowingStatus";
import AboutUser from "./AboutUser";
import Bar from "components/bar";
import FollowToggleBtn from "components/FollowingBtn";
import NotFound from "pages/NotFound";

import { useWindowWidth } from "hooks/useWindowWidth";

import axiosClient from "utils/AxiosClient";

export const ProfileContext = createContext();

const Profile = () => {
  const windowWidth = useWindowWidth();
  const { id } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUser = () => {
      axiosClient(`profile?id=${id}`)
        .then((response) => {
          setProfile(response.data);
        })
        .catch(() => setProfile("not found"));
    };
    getUser();
  }, [id]);

  return (
    <ProfileContext.Provider value={{ ...profile, setProfile }}>
      {profile === "not found" && <NotFound />}
      {profile && (
        <>
          <div className="container relative center px-2">
            <div className="mb-20">
              <CoverPicture />
              <div dir="rtl" className="absolute w-[95%] my-5">
                {myProfile && myProfile === id ? (
                  <FollowingStatus />
                ) : (
                  <FollowToggleBtn id={id} />
                )}
              </div>
            </div>
            <AboutUser />
          </div>
          {profile && <Content profile={profile} />}
        </>
      )}
      {windowWidth <= 768 && myProfile && <Bar />}
    </ProfileContext.Provider>
  );
};

export default Profile;
