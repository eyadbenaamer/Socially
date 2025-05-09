import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Content from "./Content";
import CoverPicture from "./CoverPicture";
import MessagingBtn from "./MessagingBtn";
import AboutUser from "./AboutUser";
import Bar from "components/bar";
import FollowToggleBtn from "components/FollowingBtn";
import NotFound from "pages/NotFound";

import { useWindowWidth } from "hooks/useWindowWidth";

import axiosClient from "utils/AxiosClient";

export const ProfileContext = createContext();

const Profile = () => {
  const windowWidth = useWindowWidth();
  const { username } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = () => {
      axiosClient(`profile?username=${username}`)
        .then((response) => {
          setProfile(response.data);
        })
        .catch(() => setProfile("not found"));
    };
    getProfile();
  }, [username]);

  return (
    <ProfileContext.Provider value={{ ...profile, setProfile }}>
      {profile === "not found" && <NotFound />}
      {profile?._id && (
        <>
          <div className="container relative center px-2">
            <div className="mb-20">
              <CoverPicture />
              <div dir="rtl" className="absolute w-[95%] my-5">
                {myProfile && myProfile.username !== username && (
                  <div className="flex gap-2 items-center">
                    <FollowToggleBtn id={profile._id} />
                    <MessagingBtn id={profile._id} />
                  </div>
                )}
              </div>
            </div>
            <AboutUser />
            {profile && <Content profile={profile} />}
          </div>
        </>
      )}
      {windowWidth < 768 && myProfile && <Bar />}
    </ProfileContext.Provider>
  );
};

export default Profile;
