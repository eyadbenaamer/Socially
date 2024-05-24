import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearSignupFields, setAuthStatus, setProfile } from "state/index.js";

import axiosClient from "utils/AxiosClient.js";

import { ReactComponent as NotFoundPicture } from "assets/not-found-2.svg";

const VerifyAccountByLink = () => {
  const { isVerified } = useSelector((state) => state.authStatus);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  dispatch(clearSignupFields());
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      axiosClient(`/verify_account?token=${token}`)
        .then((response) => {
          const { token, profile, isVerified } = response.data;
          localStorage.setItem("token", token);
          dispatch(setProfile(profile));
          dispatch(
            setAuthStatus({
              message: "",
              isLoggedin: true,
              isVerified,
            })
          );
        })
        .catch(() =>
          setMessage("Not valid or expired link. Please try again.")
        );
    }
  }, []);

  return (
    <>
      {/* once the account is verified, the router will redirect to the set profile page*/}
      {isVerified && <Navigate to={"/set-profile"} />}
      {message && (
        <div
          className="container flex flex-col items-center p-3 text-2xl text-center justify-center"
          style={{ height: "calc(100vh - 78px)" }}
        >
          <div className="w-full min-[425px]:w-[400px] sm:w-[500px] text-[transparent]">
            <NotFoundPicture />
          </div>
          <div className="py-14">{message}</div>
        </div>
      )}
    </>
  );
};

export default VerifyAccountByLink;
