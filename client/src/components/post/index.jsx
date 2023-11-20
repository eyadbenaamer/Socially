import axios from "axios";
import PostContent from "./post-content";
import { useEffect, useState } from "react";
import UpperPart from "./upper-part";
import { useSelector } from "react-redux";
import ReactionBar from "./reaction-bar";

const Post = (props) => {
  const {
    data: { _id, creatorId, files, text, createdAt, location, comments, likes },
  } = props;
  const [user, setUser] = useState(useSelector((state) => state.user));
  useEffect(() => {
    const getUser = async () => {
      let user = await axios
        .get(`${process.env.REACT_APP_API_URL}/profile/${creatorId}`)
        .then((response) => {
          return response.data;
        });
      setUser(user);
    };
    if (creatorId !== user._id) {
      setUser(getUser());
    }
  }, []);
  return (
    <div className="bg-200 radius w-full">
      <div>
        <UpperPart
          id={_id}
          user={user}
          createdAt={createdAt}
          location={location}
        />
      </div>
      <PostContent text={text} media={files} />
      <ReactionBar
        id={_id}
        creatorId={creatorId}
        commentsCount={comments.lenght}
        likes={likes}
      />
    </div>
  );
};

export default Post;
