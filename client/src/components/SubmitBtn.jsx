const SubmitBtn = (props) => {
  const { onClick, disabled, children, tabIndex } = props;
  return (
    <button
      tabIndex={tabIndex}
      disabled={disabled}
      className="py-1 px-4 border-solid bg-primary rounded-xl text-white disabled:opacity-70"
      onClick={() => !disabled && onClick()}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
