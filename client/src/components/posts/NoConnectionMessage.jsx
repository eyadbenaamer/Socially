import SubmitBtn from "components/SubmitBtn";

const NoConnectionMessage = (props) => {
  const { message, onClick } = props;

  return (
    <div className="flex flex-col gap-4 bg-200 rounded-xl w-full p-4 text-center">
      {message}
      <div className="w-fit my-0 mx-auto">
        <SubmitBtn onClick={onClick}>Reload</SubmitBtn>
      </div>
    </div>
  );
};

export default NoConnectionMessage;
