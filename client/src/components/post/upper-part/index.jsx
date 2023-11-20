import UserPicture from "components/UserPicture";
import { Link } from "react-router-dom";
import CreatedAt from "./CreatedAt";
import OptionsBtn from "./options-btn";

const UpperPart = ({ user, createdAt, location, id }) => {
  return (
    <div className="flex justify-between p-4">
      {user && (
        <div className="flex gap-3">
          <UserPicture
            to={`/profile/${user._id}`}
            src={user.picturePath}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <div className="flex flex-col">
            <Link to={`/profile/${user._id}`}>
              <span className=" hover:underline cursor-pointer">
                {user.firstName} {user.lastName}
              </span>
            </Link>
            <div className="flex gap-2 text-slate-400 text-xs">
              <span>
                <CreatedAt createdAt={createdAt} />
              </span>
              {location && <span>in {location}</span>}
            </div>
          </div>
        </div>
      )}
      <div>
        <OptionsBtn id={id} user={user} />
      </div>
    </div>
  );
};

export default UpperPart;
