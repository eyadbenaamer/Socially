import { useWindowWidth } from "hooks/useWindowWidth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Bar from "components/bar";
import { useSelector } from "react-redux";
import NotFound from "pages/NotFound";
import CoverPicture from "./CoverPicture";
import Content from "./Content";

const Profile = () => {
  const windowWidth = useWindowWidth();
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch(`${process.env.REACT_APP_API_URL}/profile/${id}`).then(
        (response) => {
          if (response.status === 200) {
            response.json().then((data) => setProfile(data));
          } else {
            setProfile("not found");
          }
        }
      );
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
