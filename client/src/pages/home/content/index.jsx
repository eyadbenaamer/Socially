import CreatePost from "components/create-post";
import Stories from "../stories";
import Posts from "../../../components/posts";
import { useState } from "react";
import { useSelector } from "react-redux";

export const Content = () => {
  const [createdPost, setCreatedPost] = useState(null);
  const { _id: id } = useSelector((state) => state.user);
  return (
    <section className="flex flex-col px-4 gap-3 justify-center">
      {/* <Stories /> */}
      <CreatePost setCreatedPost={setCreatedPost} />
      <Posts createdPost={createdPost} />
    </section>
  );
};
