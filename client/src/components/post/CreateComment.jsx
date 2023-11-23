import UserPicture from "components/UserPicture";
import { useRef } from "react";
import { useSelector } from "react-redux";

const CreateComment = (props) => {
  const user = useSelector((state) => state.user);
  return (
    <div className=" px-4 pt-3">
      <div className="flex gap-3 items-center">
        <UserPicture
          id={user._id}
          src={user.picturePath}
          name={`${user.firstName} ${user.lastName}`}
        />
        <div className=" w-full bg-300 pt-1 px-2 radius shadow-sm">
          <textarea
            className="comment-input h-6 w-3/4"
            placeholder="Write a comment"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
