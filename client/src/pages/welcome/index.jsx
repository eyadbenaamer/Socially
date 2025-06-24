import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthStatus, setProfile } from "state";

import SubmitBtn from "components/SubmitBtn";

import axiosClient from "utils/AxiosClient";
import UsernameInput from "./UsernameInput";
import Pictures from "./Pictures";
import { connectToSocketServer } from "hooks/useHandleSocket";

const Welcome = () => {
  const [data, setData] = useState({
    username: sessionStorage.getItem("username") ?? "",
    bio: sessionStorage.getItem("bio") ?? "",
    location: sessionStorage.getItem("location") ?? "",
    profilePic: null,
    coverPic: null,
  });
  const [isValidInputs, setIsValidInputs] = useState({
    username: false,
    bio: false,
    location: false,
  });

  const dispatch = useDispatch();

  const checkValues = () => {
    if (data.bio.length <= 1000) {
      setIsValidInputs((prev) => ({ ...prev, bio: true }));
    } else {
      setIsValidInputs((prev) => ({ ...prev, bio: false }));
    }
    if (data.location.length <= 20) {
      setIsValidInputs((prev) => ({ ...prev, location: true }));
    } else {
      setIsValidInputs((prev) => ({ ...prev, location: false }));
    }
  };

  useEffect(checkValues, []);

  const isDisabled = () => {
    for (const key in isValidInputs) {
      if (!isValidInputs[key]) {
        return true;
      }
    }
    return false;
  };
  return (
    <section className="auth container py-6 px-2">
      <div className="auth flex flex-col gap-4 p-6 bg-300 rounded-xl">
        <h1 className="text-2xl text-primary">You're almost there!</h1>
        <h2 className="text-lg">
          Now set your username and profile and cover pictures and bio.
        </h2>
        {/* set profile and cover pictures component */}
        <Pictures setData={setData} />
        <div className="flex flex-col gap-4 max-w-sm">
          {/* set username component */}
          <UsernameInput
            fieldValue={data.username}
            setData={setData}
            setIsValid={(isValid) =>
              setIsValidInputs({ ...isValidInputs, username: isValid })
            }
          />
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              name="bio"
              className="h-[200px] overflow-y-scroll"
              defaultValue={data.bio}
              onChange={(e) => {
                checkValues();
                const value = e.target.value.trim();
                window.sessionStorage.setItem("bio", value);
                setData((prev) => ({
                  ...prev,
                  bio: value,
                }));
                setIsValidInputs((prev) => ({
                  ...prev,
                  bio: !value || value.length <= 1000,
                }));
              }}
            ></textarea>
            <div className="flex justify-between text-sm h-4 my-1">
              <div className="text-red-500">
                {data.bio.length > 1000 && <>Bio is too large.</>}
              </div>
              <div>{data.bio.length}/1000</div>
            </div>
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={data.location}
              onChange={(e) => {
                checkValues();
                const value = e.target.value.trim();
                window.sessionStorage.setItem("location", value);
                setData((prev) => ({
                  ...prev,
                  location: value,
                }));
                setIsValidInputs((prev) => ({
                  ...prev,
                  location: !value || value.length <= 20,
                }));
              }}
            />
            <div className="flex justify-between text-sm h-4 my-1">
              <div className="text-red-500">
                {data.location.length > 20 && <>Location name is too large.</>}
              </div>
              <div>{data.location.length}/20</div>
            </div>
          </div>
        </div>
        <div className="self-center">
          <SubmitBtn
            disabled={isDisabled()}
            onClick={async () => {
              const formData = new FormData();
              for (const key in data) {
                formData.append(key, data[key]);
              }
              await axiosClient
                .patch(`profile/set`, formData)
                .then((resposnse) => {
                  // if the request was successful, the response will return the updated profile
                  dispatch(setAuthStatus({ email: "", token: "" }));
                  dispatch(setProfile(resposnse.data));
                  connectToSocketServer();
                })
                .catch(() => {});
            }}
          >
            Set profile
          </SubmitBtn>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
