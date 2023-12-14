const SubmitBtn = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button
      disabled={disabled}
      className="py-2 px-4 border-solid bg-primary radius text-white disabled:opacity-70"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
