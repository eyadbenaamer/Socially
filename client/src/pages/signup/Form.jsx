import Dropzone from "../../components/dropzone";
export let data = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  birthDate: "",
  picture: null,
  gender: "",
};

const Form = () => {
  const handleChange = async (e) => {
    data = {
      ...data,
      [e.target.name]: e.target.value,
    };
  };

  return (
    <>
      <div>
        <input type="text" name="firstName" onChange={handleChange} />
        <input type="text" name="lastName" onChange={handleChange} />
        <input type="email" name="email" onChange={handleChange} />
        <input type="password" name="password" onChange={handleChange} />
        <input type="date" name="birthDate" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <Dropzone
          onChange={(file) => {
            data.picture = file;
          }}
        />
      </div>
    </>
  );
};
export default Form;
