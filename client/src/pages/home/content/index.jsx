import CreatePost from "components/create-post";
import Stories from "../stories";
import Posts from "../posts";

export const Content = () => {
  return (
    <section className="flex flex-col items-center px-4 gap-3">
      {/* <Stories /> */}
      <CreatePost />
      {/* <Posts /> */}
    </section>
  );
};
