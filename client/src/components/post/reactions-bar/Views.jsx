import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PostContext } from "..";

import axiosClient from "utils/AxiosClient";
import convertToUnit from "utils/convertToUnit";

import { ReactComponent as ViewsIcon } from "assets/icons/eye.svg";

const Views = () => {
  const { views } = useContext(PostContext);

  return (
    <div className="flex items-center gap-1 mx-3">
      <div className="w-5">
        <ViewsIcon />
      </div>
      <span>{convertToUnit(views.length)}</span>
    </div>
  );
};

export default Views;
