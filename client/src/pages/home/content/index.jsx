import CreatePost from "components/create-post";
import Stories from "../stories";
import Posts from "../../../components/posts";
import { useEffect, useMemo, useState } from "react";
import Post from "components/post";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export const Content = () => {
  const [createdPost, setCreatedPost] = useState(null);
  const { _id: id } = useSelector((state) => state.user);
  return (
    <section className="flex flex-col px-4 gap-3 justify-center">
      {/* <Stories /> */}
      <CreatePost setCreatedPost={setCreatedPost} />
      <Posts id={id} createdPost={createdPost} />
    </section>
  );
};
