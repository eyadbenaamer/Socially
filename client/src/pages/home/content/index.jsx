import { useSelector } from "react-redux";

import Posts from "components/posts";

export const Content = () => {
  const { _id: id } = useSelector((state) => state.user);
  return (
    <section className="flex flex-col px-2 gap-3 justify-center">
      <Posts />
    </section>
  );
};
