import Posts from "components/posts";

const Content = (props) => {
  const { profile } = props;
  const { _id: id } = profile;
  return (
    <div className="flex flex-col items-center py-5 min-h-screen pt-5 pb-28 center sm:w-4/5 lg:w-3/4 xl:w-1/2">
      <section className="content flex flex-col px-2 gap-3 w-full my-0 m-auto">
        {profile && <Posts id={id} />}
      </section>
    </div>
  );
};

export default Content;
