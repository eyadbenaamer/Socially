import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "pages/home";
import Login from "pages/login";
import VerifyAccount from "pages/verify-account";
import Signup from "pages/signup";
import Profile from "pages/profile";
import Notifications from "pages/notifications";
import SavedPosts from "pages/saved-posts";
import Messages from "pages/messages";
import Header from "components/header";

import "./assets/index.css";
import ResetPassword from "pages/reset-password";
import SetProfile from "pages/set-profile";
import { useEffect } from "react";
import PostViewer from "pages/post-viewer";

const App = () => {
  const isLoggedin = useSelector((state) => state.loginStatus.isLoggedIn);
  const isVerified = useSelector((state) => state.isVerified);
  const isNotVerified = sessionStorage.getItem("isNotVerified") && !isVerified;
  const mode = useSelector((state) => state.settings.mode);

  return (
    <BrowserRouter>
      <div className={`App ${mode} bg-100`}>
        <Header />
        <main className=" relative pt-5 bg-100 min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedin ? (
                  <Home />
                ) : (
                  <Navigate to={"/login"} replace={true} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isLoggedin ? <Navigate to="/" replace={true} /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedin ? <Navigate to="/" replace={true} /> : <Signup />
              }
            />
            <Route
              path="/reset-password"
              element={
                isLoggedin ? (
                  <Navigate to={"/"} replace={true} />
                ) : (
                  <ResetPassword />
                )
              }
            />
            <Route
              path="/verify-account"
              element={
                isNotVerified ? (
                  <VerifyAccount />
                ) : (
                  <Navigate to="/set-profile" replace={true} />
                )
              }
            />
            <Route
              path="/set-profile"
              element={
                isVerified ? <SetProfile /> : <Navigate to="/" replace={true} />
              }
            />
            <Route path="/post/:userId/:postId" element={<PostViewer />} />

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
            <Route
              path="/profile/:id"
              element={
                isLoggedin ? <Profile /> : <Navigate to="/" replace={true} />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
export default App;
