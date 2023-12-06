import Text from "components/Text";
import UserPicture from "components/UserPicture";
import OptionsBtn from "pages/post/post-content/options-btn";
import useFetchUser from "hooks/useFetchUser";

const Reply = (props) => {
  const {
    reply: { _id, createdAt, creatorId, content, likes, replies },
  } = props;
  const [user] = useFetchUser(creatorId);
  return (
    <>
      {props.reply && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-start">
              <div className="flex scale-90">
                <UserPicture
                  id={user._id}
                  src={user.picturePath}
                  name={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <div className="bg-300 radius p-3 shadow-sm">
                {<Text text={content} />}
              </div>
            </div>
            <OptionsBtn id={_id} user={user} />
          </div>
        </div>
      )}
    </>
  );
};

export default Reply;
