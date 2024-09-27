import { useSelector } from "react-redux";

import MyMessage from "./MyMessage";
import OthersMessage from "./OthersMessage";

const Message = (props) => {
  const { senderId } = props.message;
  const profile = useSelector((state) => state.profile);

  return (
    <>
      {profile._id === senderId && <MyMessage message={props.message} />}
      {profile._id !== senderId && <OthersMessage message={props.message} />}
    </>
  );
};

export default Message;
