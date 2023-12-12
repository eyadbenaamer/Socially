import { useWindowWidth } from "hooks/useWindowWidth";
import CreatePost from "components/create-post";
import Posts from "components/posts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Bar from "components/bar";
import { useSelector } from "react-redux";
import NotFound from "pages/NotFound";

const Profile = () => {
  const windowWidth = useWindowWidth();
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [createdPost, setCreatedPost] = useState(null);
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
          <div className="mx-1 sm:mx-4">
            <div className="bg-200 h-[200px] radius w-full">
              {profile && (
                <img
                  className=" max-h-full w-full radius"
                  src={profile.coverPath}
                />
              )}
            </div>
            {profile && (
              <div className="container center relative bottom-16 sm:bottom-24 ">
                <div className="flex flex-col items-center w-fit gap-2">
                  <div className="circle w-32 sm:w-48 border-2 bg-300">
                    <img
                      className=" max-h-full w-full radius "
                      src={profile.picturePath}
                    />
                  </div>
                  <span className="text-3xl">
                    {profile.firstName} {profile.lastName}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center py-5 min-h-screen pt-5 pb-20">
            <div className="w-full md:w-3/5">
              <section className="content flex flex-col px-2 gap-3 w-full lg:w-3/4  my-0 m-auto">
                {user && id === user._id && (
                  <CreatePost setCreatedPost={setCreatedPost} />
                )}
                {profile && (
                  <Posts id={profile._id} createdPost={createdPost} />
                )}
              </section>
            </div>
          </div>
        </>
      )}

      {windowWidth <= 768 && user && <Bar />}
    </>
  );
};

export default Profile;
