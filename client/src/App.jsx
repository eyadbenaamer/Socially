import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { logout, setAuthStatus, setProfile } from "state";
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
import InfoMessage from "components/InfoMessage";

import axios from "axios";
import VerifyAccountByLink from "pages/VerifyAccountByLink";
import NotFound from "pages/NotFound";

const App = () => {
  //if user is stored in redux state, then the user is logged in
  const { isLoggedin, isVerified, email } = useSelector(
    (state) => state.authStatus
  );

  const theme = useSelector((state) => state.settings.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    /*
      the app's loading effect dependes on this variable, when the app loads for the first time then
      the loading effect will be triggered after that it won't be triggered because of this variable.
    */
    sessionStorage.setItem("isLoaded", true);
    /*
    check if the token that saved in thr local storage is 
    valid in the backend or not once the app is loaded.
    */
    const token = localStorage.getItem("token");
    if (token) {
      axios(`${process.env.REACT_APP_API_URL}/login`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.status === 200) {
            dispatch(setProfile(response.data));
            dispatch(setAuthStatus({ isLoggedin: true }));
          }
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, []);

  return (
    <BrowserRouter>
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
                isLoggedin && isVerified ? (
                  <Home />
                ) : (
                  <Navigate to={"/login"} replace={true} />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isLoggedin ? (
                  <Login />
                ) : isLoggedin && !isVerified ? (
                  <Navigate to="/verify-account" />
                ) : (
                  <Navigate to="/" replace={true} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !isLoggedin ? <Signup /> : <Navigate to="/" replace={true} />
              }
            />
            <Route
              path="/reset-password"
              element={
                !isLoggedin ? (
                  <ResetPassword />
                ) : (
                  <Navigate to={"/"} replace={true} />
                )
              }
            />
            <Route
              path="/verify-account"
              element={
                isLoggedin && !isVerified ? (
                  <VerifyAccount />
                ) : isLoggedin && email && isVerified ? (
                  <Navigate to="/set-profile" replace={true} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/verify-account/:token"
              element={
                isLoggedin && !isVerified ? (
                  <VerifyAccountByLink />
                ) : isLoggedin && email && isVerified ? (
                  <Navigate to="/set-profile" replace={true} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/set-profile"
              element={
                isLoggedin && isVerified && email ? (
                  <SetProfile />
                ) : isLoggedin && !isVerified && email ? (
                  <Navigate to="/verify-account" replace={true} />
                ) : (
                  <Navigate to="/" replace={true} />
                )
              }
            />
            <Route path="/post/:userId/:postId" element={<Post />} />
            <Route path="/post/:userId/:postId/:commentId" element={<Post />} />
            <Route
              path="/post/:userId/:postId/:commentId/:replyId"
              element={<Post />}
            />
            <Route
              path="/notifications"
              element={
                isLoggedin ? (
                  <Notifications />
                ) : (
                  <Navigate to="/" replace={true} />
                )
              }
            />
            <Route
              path="/messages"
              element={
                isLoggedin ? <Messages /> : <Navigate to="/" replace={true} />
              }
            />
            <Route
              path="/saved-posts"
              element={
                isLoggedin ? <SavedPosts /> : <Navigate to="/" replace={true} />
              }
            />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InfoMessage />
        </motion.main>
      </div>
    </BrowserRouter>
  );
};
export default App;
