const Alert = ({ message, type }) => {
  return <div className={`w-full p-4 radius alert ${type}`}>{message}</div>;
};

export default Alert;
