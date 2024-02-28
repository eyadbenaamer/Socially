import CreatePost from "components/create-post";
import Posts from "components/posts";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Content = (props) => {
  const { profile } = props;
  const [createdPost, setCreatedPost] = useState(null);
  const user = useSelector((state) => state.user);
  const { _id: id } = profile;

  return (
    <div className="flex flex-col items-center py-5 min-h-screen pt-5 pb-20">
      <div className="w-full md:w-3/5">
        <section className="content flex flex-col px-2 gap-3 w-full lg:w-3/4  my-0 m-auto">
          {user && id === user._id && (
            <CreatePost setCreatedPost={setCreatedPost} />
          )}
          {profile && <Posts id={id} createdPost={createdPost} />}
        </section>
      </div>
    </div>
  );
};

export default Content;
