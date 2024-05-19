const SubmitBtn = (props) => {
  const { onClick, disabled, children, tabIndex } = props;
  return (
    <button
      className="w-full py-1 px-4 border-solid bg-primary rounded-xl text-white disabled:opacity-70"
      tabIndex={tabIndex}
      disabled={disabled}
      onClick={() => !disabled && onClick()}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
