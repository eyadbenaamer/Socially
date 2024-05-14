import Posts from "components/posts";

const Content = (props) => {
  const { profile } = props;
  const { _id: id } = profile;
  return (
    <div className="flex flex-col items-center py-5 min-h-screen pt-5 pb-28">
      <div className="w-full md:w-3/5">
        <section className="content flex flex-col px-2 gap-3 w-full lg:w-3/4 my-0 m-auto">
          {profile && <Posts id={id} />}
        </section>
      </div>
    </div>
  );
};

export default Content;
