import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PostContext } from "..";

import axiosClient from "utils/AxiosClient";
import convertNumber from "utils/convertNumber";

import { ReactComponent as ViewsIcon } from "assets/icons/eye.svg";

const Views = () => {
  const { _id: postId, creatorId } = useContext(PostContext);
  const user = useSelector((state) => state.user);
  const [views, setViews] = useState(useContext(PostContext).views);
  useEffect(() => {
    //if the post viewer is a logged in user, then they will be included in the post's views
    if (user) {
      //if the user is not included at the post's views, then they will be included in the post's views
      if (!views.includes(user._id)) {
        axiosClient
          .patch(`/post/set_viewed?userId=${creatorId}&postId=${postId}`)
          .then(() => setViews((prev) => [user._id, ...prev]));
      }
    }
  }, []);

  return (
    <div className="flex items-center gap-1 mx-3">
      <div className="w-5">
        <ViewsIcon className="" />
      </div>
      <span>{convertNumber(views.length)}</span>
    </div>
  );
};

export default Views;
