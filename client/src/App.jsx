import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { setAuthStatus, setProfile } from "state";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import Home from "pages/home";
import Login from "pages/login";
import VerifyAccount from "pages/verify-account";
import Signup from "pages/signup";
import Profile from "pages/profile";
import Notifications from "pages/notifications";
import SavedPosts from "pages/saved-posts";
import Messages from "pages/messages";
import ResetPassword from "pages/reset-password";
import SetProfile from "pages/set-profile";
import Post from "pages/post";

import Header from "components/header";
import Loading from "components/Loading";
import InfoMessage from "components/InfoMessage";

import axiosClient from "utils/AxiosClient";

import "./assets/index.css";

const App = () => {
  //if user is stored in redux state, then the user is logged in
  const { isLoggedIn } = useSelector((state) => state.authStatus);
  const theme = useSelector((state) => state.settings.theme);
  const profile = useSelector((state) => state.profile);
  const { isVerified } = useSelector((state) => state.authStatus);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const openedSession = sessionStorage.getItem("openedSession");

  useEffect(() => {
    if (profile) {
      axiosClient(`/profile?id=${profile._id}`).then((response) => {
        if (response.status === 200) {
          dispatch(setProfile(response.data));
        } else {
          sessionStorage.clear();
          dispatch(setAuthStatus(null));
        }
      });
    }
    setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("openedSession", true);
    }, 2200);
  }, []);

  return (
    <BrowserRouter>
      {isLoading && !openedSession ? (
        <Loading />
      ) : (
        <div className={`App ${theme} bg-100 min-h-screen`}>
          <Header />
          <motion.main
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "linear" }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Home />
                  ) : (
                    <Navigate to={"/login"} replace={true} />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isLoggedIn ? <Navigate to="/" replace={true} /> : <Login />
                }
              />
              <Route
                path="/signup"
                element={
                  isLoggedIn ? <Navigate to="/" replace={true} /> : <Signup />
                }
              />
              <Route
                path="/reset-password"
                element={
                  isLoggedIn ? (
                    <Navigate to={"/"} replace={true} />
                  ) : (
                    <ResetPassword />
                  )
                }
              />
              <Route
                path="/verify-account"
                element={
                  true ? (
                    <VerifyAccount />
                  ) : (
                    <Navigate to="/set-profile" replace={true} />
                  )
                }
              />
              <Route
                path="/set-profile"
                element={
                  isVerified && !isLoggedIn ? (
                    <SetProfile />
                  ) : (
                    <Navigate to="/" replace={true} />
                  )
                }
              />
              <Route path="/post/:userId/:postId" element={<Post />} />
              <Route
                path="/post/:userId/:postId/:commentId"
                element={<Post />}
              />
              <Route
                path="/post/:userId/:postId/:commentId/:replyId"
                element={<Post />}
              />
              <Route
                path="/notifications"
                element={
                  isLoggedIn ? (
                    <Notifications />
                  ) : (
                    <Navigate to="/" replace={true} />
                  )
                }
              />
              <Route
                path="/messages"
                element={
                  isLoggedIn ? <Messages /> : <Navigate to="/" replace={true} />
                }
              />
              <Route
                path="/saved-posts"
                element={
                  isLoggedIn ? (
                    <SavedPosts />
                  ) : (
                    <Navigate to="/" replace={true} />
                  )
                }
              />
              <Route
                path="/profile/:id"
                element={
                  true ? <Profile /> : <Navigate to="/" replace={true} />
                }
              />
            </Routes>
            <InfoMessage />
          </motion.main>
        </div>
      )}
    </BrowserRouter>
  );
};
export default App;
