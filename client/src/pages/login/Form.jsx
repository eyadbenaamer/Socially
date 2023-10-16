import { useState } from "react";

export let data = {
  email: "",
  password: "",
};

const Form = () => {
  const [stateData, setStateData] = useState(data);
  const handleChange = (e) => {
    data = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setStateData(data);
  };

  return (
    <div>
      <input type="email" name="email" onChange={handleChange} />
      <input type="password" name="password" onChange={handleChange} />
    </div>
  );
};
export default Form;
