import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "pages/home";
import Landing from "pages/landing";
import Login from "pages/login";
import Signup from "pages/signup";
import Profile from "pages/profile";
import OtherUserProfile from "pages/other-user-profile";

import "./assets/index.css";
const App = () => {
  const isLoggedin = Boolean(useSelector((state) => state.token));
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedin ? <Home /> : <Landing />
          }
        />
        <Route
          path="/login"
          element={isLoggedin ? <Navigate to="/" replace={true} /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedin ? <Navigate to="/" replace={true} /> : <Signup />}
        />
        <Route
          path="/profile"
          element={
            isLoggedin ? <Profile /> : <Navigate to="/" replace={true} />
          }
        />
        <Route path="/profile/:id" element={<OtherUserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
