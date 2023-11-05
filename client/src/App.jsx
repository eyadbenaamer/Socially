import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "pages/home";
import Landing from "pages/landing";
import Login from "pages/login";
import Signup from "pages/signup";
import Profile from "pages/profile";
import OtherUserProfile from "pages/other-user-profile";
import Notifications from "pages/notifications";
import SavedPosts from "pages/saved-posts";
import Messages from "pages/messages";
import Header from "components/header";

import "./assets/index.css";

const App = () => {
  const isLoggedin = Boolean(useSelector((state) => state.token));
  const mode = useSelector((state) => state.settings.mode);
  return (
    <BrowserRouter>
      <div className={`App ${mode} bg-100`}>
        <Header />
        <main className=" relative top-[62px] pt-5 bg-100 min-h-screen">
          <Routes>
            <Route path="/" element={isLoggedin ? <Home /> : <Landing />} />
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
              path="/profile"
              element={
                isLoggedin ? <Profile /> : <Navigate to="/" replace={true} />
              }
            />
            <Route path="/profile/:id" element={<OtherUserProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
export default App;
