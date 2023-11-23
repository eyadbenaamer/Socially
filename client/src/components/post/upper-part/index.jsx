import OptionsBtn from "./options-btn";
import { CreatorInfo } from "./CreatorInfo";

const UpperPart = ({ user, createdAt, location, id }) => {
  return (
    <div className="flex justify-between px-2">
      <CreatorInfo
        user={user}
        createdAt={createdAt}
        location={location}
        id={id}
      />
      <div>
        <OptionsBtn id={id} user={user} />
      </div>
    </div>
  );
};

export default UpperPart;
