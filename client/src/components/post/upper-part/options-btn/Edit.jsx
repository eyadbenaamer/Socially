import axios from "axios";
import Dialog from "components/Dialog";
import RedBtn from "components/RedBtn";
import { useContext, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../../assets/icons/trash-basket.svg";
import PrimaryBtn from "components/PrimaryBtn";
import { useSelector } from "react-redux";

const Edit = (props) => {
  const { id, user, setIsModifying } = props;

  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => {
          setIsModifying(true);
        }}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Edit the post
      </button>
    </li>
  );
};

export default Edit;
